// standardize the WhatsApp prefilled order message format for pickup and delivery orders

const standardizeOrderMessage = (order) => {
    const { items, total, deliveryInfo, detailedAddress } = order;
    let message = '';

    items.forEach(item => {
        const { name, quantity, lineTotal } = item;
        message += `${name} - ${quantity} x ₹${lineTotal.toFixed(0)}\n`;
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    message += `Subtotal: ₹${subtotal.toFixed(0)}\n`;

    if (order.type === 'delivery') {
        const { deliveryCharge, deliveryNote } = deliveryInfo;
        message += `Delivery: ₹${deliveryCharge}\nNote: ${deliveryNote} \n`;
        message += `TOTAL: ₹${total.toFixed(0)}\n`;
        message += `Payment: On Delivery\n`;
        message += `Maps Link: https://www.google.com/maps?q=${detailedAddress.flatNo}+${detailedAddress.building}+${detailedAddress.area}\n`;
        message += `Address: ${detailedAddress.flatNo}, ${detailedAddress.building}, ${detailedAddress.area}\n`;
    } else {
        message += `TOTAL: ₹${total.toFixed(0)}\n`;
    }

    return message;
};

export default standardizeOrderMessage;