
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export const generateInvoice = (order: Order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(217, 119, 6); // Amber-600
    doc.text('Kanti Bakes & Flakes', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('A Legacy of Sweetness Since 1957', 14, 26);
    doc.text('Attibele, Bangalore, KA 562107', 14, 30);
    doc.text('GSTIN: 29AAAAA0000A1Z5', 14, 34);

    // Invoice Details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('INVOICE', 160, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice No: INV-${order.id.replace('ORD-', '')}`, 160, 26, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 30, { align: 'right' });

    // Bill To
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text('Bill To:', 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(order.customerName, 14, 56);
    doc.text(order.customerPhone, 14, 61);
    const splitAddress = doc.splitTextToSize(order.address, 80);
    doc.text(splitAddress, 14, 66);

    // Table
    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        headStyles: { fillColor: [217, 119, 6], textColor: 255 }, // Amber-600
        styles: { fontSize: 10 },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Subtotal:`, 140, finalY);
    doc.text(`Rs. ${(order.total - (order.shippingCharge || 0) - (order.tax || 0)).toFixed(2)}`, 190, finalY, { align: 'right' });

    doc.text(`Tax:`, 140, finalY + 6);
    doc.text(`Rs. ${(order.tax || 0).toFixed(2)}`, 190, finalY + 6, { align: 'right' });

    doc.text(`Shipping:`, 140, finalY + 12);
    doc.text(`Rs. ${(order.shippingCharge || 0).toFixed(2)}`, 190, finalY + 12, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total:`, 140, finalY + 20);
    doc.text(`Rs. ${order.total.toFixed(2)}`, 190, finalY + 20, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text('Thank you for your order! Please visit us again.', 105, 280, { align: 'center' });

    doc.save(`Invoice_${order.id}.pdf`);
};
