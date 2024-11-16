import React, { useState, useRef, useEffect } from 'react';
import bwipjs from 'bwip-js';
import './GenerateBarcode.css';

const GenerateBarcode = () => {
    const [barcodeValue, setBarcodeValue] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [format, setFormat] = useState('Normal');
    const canvasRef = useRef();

    // Use useEffect to update the barcode when any of the inputs change
    useEffect(() => {
        if (barcodeValue.trim()) {
            generateBarcode();
        }
    }, [barcodeValue, productName, productPrice]); // Depend on barcode value, name, and price

    const generateBarcode = () => {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

            // Generate the barcode with bwipjs
            bwipjs.toCanvas(canvas, {
                bcid: 'code128',
                text: barcodeValue,
                scale: 5,
                height: 10,
                includetext: true,
                textxalign: 'center',
            }, (err) => {
                if (err) {
                    console.error('Error generating barcode:', err);
                } else {
                    // Draw the product details below the barcode after it is generated
                    drawProductDetails();
                }
            });
        } catch (e) {
            console.error('Error generating barcode:', e);
        }
    };

    const drawProductDetails = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        // Ensure there's space below the barcode before drawing text
        if (productName && productPrice) {
            const barcodeHeight = 100; // Adjust as needed based on your barcode size
            ctx.fillText(productName, canvas.width / 2, barcodeHeight + 20); // Product Name
            ctx.fillText(`Price: Rs ${productPrice}`, canvas.width / 2, barcodeHeight + 40); // Price
        }
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const htmlContent = `
        <html>
            <head>
                <title>Print Barcode - ${format}</title>
                <style>
                *{
                    margin-left: 0px;
                }
                    body {
                        margin: 0;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 100vh;
                        background-color: #f9f9f9;
                    }
                    .barcode-container {
                        display: flex;
                        ${format === 'Rattail' ? 'flex-direction: row;' : 'flex-direction: column;'}
                        align-items: flex-start;
                        padding: 10px;
                        width: ${format === 'Rattail' ? '30rem' : '20rem'};
                        background-color: #eee;
                        border-radius: 8px;
                        margin-left: ${format === 'Rattail' ? '0px' : '0px'};
                    }
                    .product-details {
                        ${format === 'Rattail' ? 'margin-right: 10px;' : 'margin-bottom: 20px;'}
                        width: ${format === 'Rattail' ? '200px' : '0px'};
                        font-size: 25px;
                        text-align: left;
                    }
                    .product-name {
                        font-size: 30px;
                        font-weight: bold;
                        margin: 0;
                    }
                    .product-price {
                        font-size: 30px;
                        
                        width: ${format === 'Rattail' ? '300px' : '0px'};
                        margin: 10px 0 0;
                        margin-top: ${format === 'Rattail' ? '35px' : '10px'};
                    }
                    .barcode-image {
                        width: 200px;
                        height: 100px;
                        ${format === 'Rattail' ? 'margin-left: 40px;' : 'margin-top: 10px;'}
                        margin-left: ${format === 'Rattail' ? '200px' : '0rem'};
                    }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                <div class="barcode-container">
                    <div class="product-details">
                        <h2 class="product-name">${productName}</h2>
                        <h3 class="product-price">Rs ${productPrice}</h3>
                    </div>
                    <img src="${dataUrl}" alt="Barcode" class="barcode-image" />
                </div>
            </body>
        </html>
        `;

        // Print the content to the console for debugging
        console.log(htmlContent);

        // Create a new window and print
        const newWindow = window.open('', '_blank', 'width=600,height=400');
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    };

    return (
        <div className="barcode-container">
            <h1>Barcode Generator</h1>
            <form className="barcode-form">
                <div className="form-group">
                    <label>
                        Barcode Value:
                        <input
                            type="text"
                            value={barcodeValue}
                            onChange={(e) => setBarcodeValue(e.target.value)}
                            required
                            placeholder="Enter barcode value"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Product Name:
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            placeholder="Enter product name"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Product Price:
                        <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                            placeholder="Enter product price"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Format:
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="cool-dropdown"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Rattail">Rattail</option>
                        </select>
                    </label>
                </div>
                <button type="button" onClick={handlePrint} className="print-button">
                    Print
                </button>
            </form>

            <canvas ref={canvasRef} width={300} height={150} style={{ border: '1px solid black' }} />
        </div>
    );
};

export default GenerateBarcode;
