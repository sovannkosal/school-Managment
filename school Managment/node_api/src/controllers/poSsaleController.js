const { DATE } = require('sequelize');
const { Sale, SaleItemDetail, MasterProduct, PaymentMethod } = require('../models');
const logError = require('../utils/logger');
const { alertNewSale } = require('../utils/sendtelegram');

const parseNumericId = (value) => {
    if (!value) return null;
    const digits = value.toString().trim();
    return /^[0-9]+$/.test(digits) ? BigInt(digits) : null;
};

const getNextNumericIds = async () => {
    const sales = await Sale.findAll({ attributes: ['sale_id', 'invoice_id'] });
    let maxSale = 0n;
    let maxInvoice = 0n;

    sales.forEach((sale) => {
        const saleNum = parseNumericId(sale.sale_id);
        const invoiceNum = parseNumericId(sale.invoice_id);
        if (saleNum !== null && saleNum > maxSale) maxSale = saleNum;
        if (invoiceNum !== null && invoiceNum > maxInvoice) maxInvoice = invoiceNum;
    });

    return {
        nextSaleId: (maxSale + 1n).toString().padStart(2, '0'),
        nextInvoiceId: (maxInvoice + 1n).toString().padStart(2, '0'),
    };
};

const getSaleHistory = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            order: [['created_on', 'DESC']],
            include: [
                {
                    model: PaymentMethod,
                    as: 'PaymentMethod',
                    attributes: ['code', 'type'],
                },
                {
                    model: SaleItemDetail,
                    as: 'SaleItemDetails',
                    include: [
                        {
                            model: MasterProduct,
                            as: 'MasterProduct',
                            attributes: ['prd_id', 'prd_name', 'photo'],
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({
            success: true,
            data: sales,
        });
    } catch (error) {
        console.error('Error fetching sale history:', error);
        const errorMsg = error.errors ? error.errors.map((e) => e.message).join(', ') : (error.message || 'Unknown error');
        return logError('posSaleController', errorMsg, res);
    }
};

// GET all products or get by ID
const saleItem = async (req, res) => {
    try {
         //body parameters
        const {
            sale_date,
            amount,
            sub_total,
            tax,
            pay_method,
            create_by,
            created_on
        } = req.body;
        const { nextSaleId, nextInvoiceId } = await getNextNumericIds();
        const sale_id = nextSaleId;

        const sale = await Sale.create({
            sale_id,
            invoice_id: nextInvoiceId,
            sale_date,
            amount,
            sub_total,
            tax,
            pay_method,
            create_by,
            created_on
        }); // save to database for sale item (header table)

        //sale details
        const ListItemSale = req.body.saleItems || req.body.items;
        if (!Array.isArray(ListItemSale) || ListItemSale.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'saleItems or items array is required',
            });
        }

        for (let i = 0; i < ListItemSale.length; i++) {
            const item = ListItemSale[i];
            const std_id = item.std_id || `std${Date.now()}_${i}`; // unique: timestamp + index or provided id
            await SaleItemDetail.create({
                std_id: std_id,
                sale_id: sale_id, // use the provided or generated sale_id from the header
                prd_id: item.prd_id,
                qty: item.qty,
                price: item.price,
            });

            // Update stock quantity for each product sold
            var product = await MasterProduct.findByPk(item.prd_id);
            if (product) {
                product.qty = product.qty - item.qty; // reduce stock by quantity sold
                await product.save(); // save updated product back to database
            }

            //send to telegram
            alertNewSale(sale); // send sale alert to Telegram



            //notify low stock if qty is less than 10
                //seting if stock alert is on
                // if stock is on <> 5
        }


      
        res.status(200).json({
            success: true,
            message: 'Sale created successfully',
        });

    }
    catch (error) {
        console.log("Full error:", JSON.stringify(error, null, 2)); // Log full error for debugging
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);
        console.log("Error errors:", error.errors); // Sequelize validation errors
        const errorMsg = error.errors ? error.errors.map(e => e.message).join(', ') : (error.message || 'Unknown error');
        logError("posSaleController", errorMsg, res);
    }
}

const deleteSale = async (req, res) => {
    try {
        const { sale_id } = req.params;
        if (!sale_id) {
            return res.status(400).json({ success: false, message: 'Sale ID is required' });
        }

        const sale = await Sale.findOne({ where: { sale_id } });
        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        await SaleItemDetail.destroy({ where: { sale_id } });
        await sale.destroy();

        return res.status(200).json({ success: true, message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error);
        const errorMsg = error.errors ? error.errors.map((e) => e.message).join(', ') : (error.message || 'Unknown error');
        return logError('posSaleController', errorMsg, res);
    }
};

module.exports = {
    saleItem,
    getSaleHistory,
    deleteSale,
    // search,
    // create,
    // update,
    // deleteProduct
}