const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a professional PDF Invoice
 * @param {Object} data - Invoice data
 * @returns {Promise<Buffer>} - PDF Buffer
 */
exports.generateInvoicePDF = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            const {
                invoiceNumber,
                invoiceDate,
                venueName,
                ownerName,
                billingAddress,
                email,
                mobile,
                gstNumber,
                planName,
                planDuration = '1 Year',
                planPrice,
                gstAmount,
                totalAmount,
                paymentMethod,
                transactionId,
                paymentDate,
                startDate,
                expiryDate
            } = data;

            // ─── PAGE BORDER ───
            doc.rect(20, 20, 555, 802).lineWidth(1).stroke('#8B5CF6'); // Outer border
            doc.rect(25, 25, 545, 792).lineWidth(0.5).stroke('#EC4899'); // Inner subtle pink border

            // ─── LOGO & HEADER ───
            const logoPath = path.join(__dirname, '../../vendor/public/PREET LOGO FILE (1).png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 45, { width: 90 });
            }

            doc.fillColor('#1E293B')
                .fontSize(22)
                .text('TAX INVOICE', 110, 55, { align: 'right', characterSpacing: 1 });

            doc.fillColor('#64748B')
                .fontSize(9)
                .text(`Invoice Number: ${invoiceNumber}`, 200, 85, { align: 'right' })
                .text(`Invoice Date: ${invoiceDate}`, 200, 100, { align: 'right' })
                .moveDown();

            // ─── COMPANY DETAILS ───
            doc.fillColor('#000000')
                .fontSize(12)
                .text('Preet Tech OPC Private Limited', 50, 150, { fontWeight: 'bold' })
                .fontSize(10)
                .text('Haldwani, Uttarakhand, India', 50, 165)
                .text('Email: support@partydial.com', 50, 180)
                .text('GSTIN: 05AAHCP4413A1Z7', 50, 195); // Example GST, update if needed

            // ─── BILLED TO ───
            doc.fontSize(12)
                .text('BILLED TO:', 350, 150, { fontWeight: 'bold' })
                .fontSize(10)
                .text(venueName, 350, 165)
                .text(ownerName || '', 350, 180)
                .text(billingAddress || '', 350, 195, { width: 200 })
                .text(`Email: ${email}`, 350, 225)
                .text(`Mobile: ${mobile}`, 350, 240);
            
            if (gstNumber) {
                doc.text(`GSTIN: ${gstNumber}`, 350, 255);
            }

            doc.moveDown();

            // ─── TABLE HEADER ───
            const tableTop = 320;
            doc.rect(50, tableTop, 500, 20).fill('#8B5CF6'); // Brand Color
            doc.fillColor('#FFFFFF')
                .fontSize(10)
                .text('Description', 60, tableTop + 5)
                .text('Duration', 250, tableTop + 5)
                .text('Price', 350, tableTop + 5, { width: 90, align: 'right' })
                .text('Total', 450, tableTop + 5, { width: 90, align: 'right' });

            const items = data.items || [
                { description: planName, duration: planDuration, price: planPrice }
            ];

            // ─── TABLE BODY ───
            let currentY = tableTop + 25;
            items.forEach(item => {
                doc.fillColor('#000000')
                    .text(item.description, 60, currentY)
                    .text(item.duration || '—', 250, currentY)
                    .text(`INR ${parseFloat(item.price).toLocaleString()}`, 350, currentY, { width: 90, align: 'right' })
                    .text(`INR ${parseFloat(item.price).toLocaleString()}`, 450, currentY, { width: 90, align: 'right' });
                currentY += 20;
            });

            // ─── TOTALS ───
            const subtotalTop = Math.max(currentY + 20, 450);
            const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
            
            doc.text('Subtotal:', 350, subtotalTop, { width: 90, align: 'right' })
                .text(`INR ${subtotal.toLocaleString()}`, 450, subtotalTop, { width: 90, align: 'right' });

            const gstTop = subtotalTop + 20;
            doc.text('GST (18%):', 350, gstTop, { width: 90, align: 'right' })
                .text(`INR ${parseFloat(gstAmount || (subtotal * 0.18)).toLocaleString()}`, 450, gstTop, { width: 90, align: 'right' });

            const totalTop = gstTop + 25;
            doc.fontSize(14)
                .fillColor('#8B5CF6')
                .text('Grand Total:', 300, totalTop, { width: 140, align: 'right', fontWeight: 'bold' })
                .text(`INR ${parseFloat(totalAmount || (subtotal * 1.18)).toLocaleString()}`, 450, totalTop, { width: 90, align: 'right', fontWeight: 'bold' });

            // ─── PAYMENT INFO ───
            const paymentInfoTop = totalTop + 60;
            doc.fillColor('#000000')
                .fontSize(10)
                .text('PAYMENT INFORMATION', 50, paymentInfoTop, { fontWeight: 'bold' })
                .text(`Method: ${paymentMethod}`, 50, paymentInfoTop + 15)
                .text(`Transaction ID: ${transactionId}`, 50, paymentInfoTop + 30)
                .text(`Payment Date: ${paymentDate}`, 50, paymentInfoTop + 45);

            // ─── SUBSCRIPTION DETAILS ───
            doc.text('SUBSCRIPTION DETAILS', 350, paymentInfoTop, { fontWeight: 'bold' })
                .text(`Billing Cycle: ${planDuration}`, 350, paymentInfoTop + 15)
                .text(`Start Date: ${startDate || paymentDate}`, 350, paymentInfoTop + 30)
                .text(`Valid Till: ${expiryDate || 'N/A'}`, 350, paymentInfoTop + 45);

            // ─── FOOTER & DECLARATION ───
            const footerTop = 730;
            doc.rect(50, footerTop, 500, 30).fill('#F8FAFC');
            doc.fillColor('#475569')
                .fontSize(9)
                .text('DECLARATION: All billing and operations managed exclusively by Preet Tech OPC Private Limited.', 50, footerTop + 10, { align: 'center', width: 500 });
            
            doc.fontSize(8)
                .fillColor('#94A3B8')
                .text('This is a computer-generated document and does not require a physical signature.', 50, footerTop + 45, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
