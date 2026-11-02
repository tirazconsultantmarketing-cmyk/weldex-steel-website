const { getSupabaseAdmin } = require("../lib/supabase-admin");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const supabase = getSupabaseAdmin();

    const [
      productsResult,
      categoriesResult,
      ordersResult
    ] = await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("categories")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
    ]);

    if (productsResult.error) throw productsResult.error;
    if (categoriesResult.error) throw categoriesResult.error;
    if (ordersResult.error) throw ordersResult.error;

    return res.status(200).json({
      success: true,
      service: "WELDEX E-Commerce",
      database: "connected",
      counts: {
        products: productsResult.count || 0,
        categories: categoriesResult.count || 0,
        orders: ordersResult.count || 0
      }
    });

  } catch (error) {
    console.error("E-commerce health error:", error);

    return res.status(500).json({
      success: false,
      database: "error",
      message: error.message || "Unable to connect to database"
    });
  }
};
