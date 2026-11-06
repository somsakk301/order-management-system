const DEMO_STORAGE_KEY = "order-management-demo-orders-v1";
const IS_DEMO_MODE = window.location.hostname.endsWith("github.io")
    || new URLSearchParams(window.location.search).get("demo") === "1"
    || window.location.protocol === "file:";

let items = [];
let editingIndex = -1;

function showNotice(message, kind = "error", onClose = null) {
    const dialog = document.getElementById("noticeDialog");
    dialog.dataset.kind = kind;
    document.getElementById("noticeTitle").textContent = kind === "success" ? "สำเร็จ" : "แจ้งเตือน";
    document.getElementById("noticeIcon").textContent = kind === "success" ? "✓" : "!";
    document.getElementById("noticeMessage").textContent = message;
    if (onClose) dialog.addEventListener("close", onClose, { once: true });
    dialog.showModal();
}

function configureDemoMode() {
    if (!IS_DEMO_MODE) return;
    document.getElementById("demoBanner").hidden = false;
    document.getElementById("historyNote").textContent = "ข้อมูลทดลองของคุณ เก็บเฉพาะในเบราว์เซอร์นี้";
    document.getElementById("clearDemoButton").hidden = false;
}

function readDemoOrders() {
    try {
        const value = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function writeDemoOrders(orders) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(orders));
}

async function getOrders() {
    if (IS_DEMO_MODE) return readDemoOrders();
    const response = await fetch("/orders", { cache: "no-store" });
    if (!response.ok) throw new Error("โหลดรายการไม่สำเร็จ");
    return response.json();
}

async function createOrder(order) {
    if (IS_DEMO_MODE) {
        const orders = readDemoOrders();
        const savedOrder = {
            ...order,
            id: Date.now(),
            items: order.items.map((item, index) => ({ ...item, id: Date.now() + index })),
            totalAmount: order.items.reduce((total, item) => total + item.subTotal, 0)
        };
        orders.push(savedOrder);
        writeDemoOrders(orders);
        return savedOrder;
    }

    const response = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error("บันทึกไม่สำเร็จ");
    return response.json();
}

document.getElementById("price").addEventListener("input", previewSubTotal);
document.getElementById("quantity").addEventListener("input", previewSubTotal);

function previewSubTotal() {
    const price = parseFloat(document.getElementById("price").value) || 0;
    const quantity = parseInt(document.getElementById("quantity").value, 10) || 0;
    document.getElementById("previewSubtotal").textContent = formatMoney(price * quantity);
}

function addItem() {
    const productName = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    if (!productName || price <= 0 || quantity <= 0) {
        showNotice("กรุณากรอกชื่อสินค้า ราคา และจำนวนให้ถูกต้อง");
        return;
    }

    const newItem = { productName, price, quantity, subTotal: price * quantity };
    if (editingIndex === -1) items.push(newItem);
    else {
        items[editingIndex] = newItem;
        editingIndex = -1;
    }

    renderTable();
    calculateTotal();
    clearItemInput();
}

function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
    return cell;
}

function renderTable() {
    const table = document.getElementById("itemTable");
    table.replaceChildren();

    items.forEach((item, index) => {
        const row = document.createElement("tr");
        appendCell(row, item.productName);
        appendCell(row, formatMoney(item.price));
        appendCell(row, item.quantity);
        appendCell(row, formatMoney(item.subTotal));

        const actions = appendCell(row, "");
        actions.className = "item-actions";
        const editButton = document.createElement("button");
        editButton.className = "btn btn-warning btn-sm";
        editButton.textContent = "แก้ไข";
        editButton.addEventListener("click", () => editItem(index));
        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.textContent = "ลบ";
        removeButton.addEventListener("click", () => removeItem(index));
        actions.append(editButton, removeButton);
        table.appendChild(row);
    });
}

function editItem(index) {
    const item = items[index];
    document.getElementById("productName").value = item.productName;
    document.getElementById("price").value = item.price;
    document.getElementById("quantity").value = item.quantity;
    editingIndex = index;
    previewSubTotal();
}

function removeItem(index) {
    items.splice(index, 1);
    renderTable();
    calculateTotal();
}

function calculateTotal() {
    const total = items.reduce((sum, item) => sum + item.subTotal, 0);
    document.getElementById("totalAmount").textContent = formatMoney(total);
}

function clearItemInput() {
    document.getElementById("productName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("previewSubtotal").textContent = "0.00";
}

function resetOrderForm() {
    ["orderNumber", "customerName", "phone", "address"].forEach(id => {
        document.getElementById(id).value = "";
    });
    items = [];
    editingIndex = -1;
    renderTable();
    calculateTotal();
    clearItemInput();
}

async function submitOrder() {
    const order = {
        orderNumber: document.getElementById("orderNumber").value.trim(),
        customerName: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        items: items.map(item => ({ ...item }))
    };

    if (!order.orderNumber || !order.customerName || !order.items.length) {
        showNotice("กรุณากรอกเลขที่คำสั่งซื้อ ชื่อลูกค้า และเพิ่มสินค้าอย่างน้อย 1 รายการ");
        return;
    }

    try {
        await createOrder(order);
        resetOrderForm();
        await loadOrders();
        const message = IS_DEMO_MODE
            ? "บันทึกข้อมูลทดลองแล้ว ข้อมูลอยู่เฉพาะในเบราว์เซอร์ของคุณ"
            : "บันทึกคำสั่งซื้อสำเร็จ";
        showNotice(message, "success");
    } catch (error) {
        showNotice("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง");
    }
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function loadOrders() {
    const status = document.getElementById("historyStatus");
    const table = document.getElementById("historyTable");
    const body = document.getElementById("historyBody");
    status.textContent = "กำลังโหลดรายการ...";
    table.hidden = true;

    try {
        const orders = await getOrders();
        if (!Array.isArray(orders)) throw new Error("ข้อมูลไม่ถูกต้อง");
        body.replaceChildren();

        if (!orders.length) {
            status.textContent = IS_DEMO_MODE
                ? "ยังไม่มีคำสั่งซื้อทดลองในเบราว์เซอร์นี้"
                : "ยังไม่มีคำสั่งซื้อที่บันทึกไว้";
            return;
        }

        orders.sort((a, b) => (b.id || 0) - (a.id || 0));
        for (const order of orders) {
            const row = document.createElement("tr");
            const products = (order.items || [])
                .map(item => `${item.productName || ""} × ${item.quantity ?? 0}`)
                .join(", ");
            [order.orderNumber, order.customerName, order.phone, order.address, products, formatMoney(order.totalAmount)]
                .forEach(value => appendCell(row, value || "—"));
            body.appendChild(row);
        }

        status.textContent = `ทั้งหมด ${orders.length} คำสั่งซื้อ`;
        table.hidden = false;
    } catch (error) {
        status.textContent = "โหลดคำสั่งซื้อไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วกดรีเฟรชรายการ";
    }
}

function clearDemoOrders() {
    if (!IS_DEMO_MODE) return;
    localStorage.removeItem(DEMO_STORAGE_KEY);
    loadOrders();
    showNotice("ล้างข้อมูลทดลองในเบราว์เซอร์นี้แล้ว", "success");
}

configureDemoMode();
loadOrders();
