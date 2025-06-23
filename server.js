const express = require("express");
const mysql = require("mysql2/promise"); // Use the `promise` version of mysql2 for async/await
const cors = require("cors");
const bcrypt = require("bcrypt"); // Ensure bcrypt is installed
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());  // For parsing application/json
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies in requests
app.use(cors({ origin: "*" }));
// Database connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "vehicule",
});

// Login endpoint
// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request received with:", email);

    // Check if the user exists
    const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    console.log("Database query result:", rows);

    if (rows.length === 0) {
      console.error("No user found with this email.");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    console.log("Password for user:", user.password);

   
    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the plaintext password with the stored hash
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const customerId = user.id;

    res.status(200).json({
      success: true,
      role: user.role,
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/signup", async (req, res) => {
  const { name, email, password} = req.body;

  try {
    // Check if the email already exists
    const [existingUser] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert the new user into the database
    const [result] = await db.query("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    
    
    ]);
    const query1 = "SELECT role FROM user WHERE email = ?";
    const [row] = await db.query(query1, [email]);
    const userRole = row[0].role;

    

    // Return success response with token
    res.status(201).json({
      success: true,
      data:userRole,
      
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.post('/addcar', async (req, res) => {
  try {
    const { carNumber, model ,email} = req.body;
    const query3="SELECT * FROM user WHERE email=?";
    const [row] = await db.query(query3, [email]);
    if (row.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }
    user=row[0];
 
    const query = "INSERT INTO car (car_model, car_number,user_id) VALUES (?, ?,?)";
    await db.query(query, [model, carNumber,user.id]);
    res.status(200).json({
      success: true,
      message: "Car added successfully"
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({
      success: false,
      message: "Error adding car"
    });
  }
    
  })

 //add service 
 app.post("/addservice", async (req, res) => {
  const { type, number, name } = req.body;

  if (!type || !number || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query1 = "SELECT * FROM car WHERE car_number = ?";
    const [row] = await db.query(query1, [number]);

    if (row.length === 0) {
      return res.status(404).json({ message: "Car not found." });
    }

    const user = row[0]
    await db.query(
      "INSERT INTO service (car_id, service_name, service_type) VALUES (?, ?, ?)",
      [user.id, name, type]
    );

    res.status(201).json({ 
      success: true,
      message: "Service added successfully." });
  } catch (error) {
    console.error("Error while adding service request:", error);
    res.status(500).json({ error: "Internal server error while adding service." });
  }
});
  
  //select car service
  app.get('/getservice', async (req, res) => {
    try {
      console.log("Received query:", req.query);

      const { carnumber } = req.query;
    console.log("Received carnumber:", carnumber);

  
      // Validate car number
      if (!carnumber) {
        return res.status(400).json({ error: "Car number is required." });
      }
  
      // Step 1: Find car by car number
      const queryCar = "SELECT id FROM car WHERE car_number = ?";
      const [rows] = await db.query(queryCar, [carnumber]); // Destructure 'rows'
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "No car found with the given car number." });
      }
  
      const carId = rows[0].id; // Extract car ID
  
      // Step 2: Find services for the car
      const queryServices = `
        SELECT 
          service_name, service_type, start_date, end_date, payment 
        FROM 
          service 
        WHERE 
          car_id = ?`;
      const [services] = await db.query(queryServices, [carId]); // Destructure 'services'
  
      // Step 3: Return services or empty list
      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      console.error("Error while getting service request:", error);
      res.status(500).json({ error: "Internal server error while getting service." });
    }
  });
  app.get('/getproduct', async (req, res) => {
    try {
      const query = "SELECT * FROM  product";
      const [serviceRequests] = await db.query(query); 
  
      if (serviceRequests.length === 0) {
        return res.status(404).json({ message: "No product" });
      }
  
      res.status(200).json({
        success: true,
        data: serviceRequests
      });
    } catch (error) {
      console.error("Error while getting service request:", error);
      res.status(500).json({ error: "Internal server error while getting service." });
    }
  });



  app.post("/create-order", async (req, res) => {
    try{
      const { productId, quantity, price,email } = req.body;
    
      const query1="SELECT id FROM user WHERE email = ?";
      const [rows] = await db.query(query1, [email]);
      if(rows.length===0){
        return res.status(404).json({ message: "User not found." });
      }
      const userId = rows[0].id;
      
      if (!productId || !quantity || !price || !userId) {
        return res.status(400).json({ error: "Product ID, quantity, price, and user ID are required." });
      }
      
      // Create the order with userId
      const [orderResult] = await db.query(
        "INSERT INTO `order` (order_status, user_id) VALUES (?, ?)",
        ["pending", userId]
      );
      //row=select id from orders where userid=userId
      const orderId = orderResult.insertId;
  
      // Add the product to the order_product table
      await db.query(
        "INSERT INTO order_product (product_id, order_id, quantity, price_product) VALUES (?, ?, ?, ?)",//handleBuy
        [productId, orderId, quantity, price]
      );
  
      res.status(201).json({ success: true, message: "Order placed successfully", orderId });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token has expired. Please log in again." });
      } else {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating order" });
      }
    }
  });
  
  app.get("/orders", async (req, res) => {
    try {
      const { email } = req.query;
  
      // Fetch the customer ID using the email
      const query1 = "SELECT id FROM user WHERE email = ?";
      const [rows] = await db.query(query1, [email]);
      console.log("Database query result:", rows);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      const customerId = rows[0].id;
  
      // Query to fetch orders and join with `our_product` table
      const query = `
        SELECT 
          o.id AS order_id,
          o.order_status,
          o.date,
          op.quantity,
          op.price_product,
          p.name AS product_name,
          p.image AS product_image
        FROM 
           \`order\` o
        JOIN 
          order_product op ON o.id = op.order_id
        JOIN 
          product p ON op.product_id = p.id 
        WHERE 
          o.user_id = ?
      `;
      
  
      const [orders] = await db.query(query, [customerId]);
  
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for the user." });
      }
  
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({
        success: false,
        message: error.sqlMessage || "Error fetching orders.",
      });
    }
  });
  //ADMIN
    //get services in admin
    app.get('/getservices', async (req, res) => {
      try {
        const query = "SELECT * FROM  service";
        const [serviceRequests] = await db.query(query); // Assuming you're using MySQL with Promises
    
        if (serviceRequests.length === 0) {
          return res.status(404).json({ message: "No service requests found ." });
        }
    
        res.status(200).json({
          success: true,
          data: serviceRequests
        });
      } catch (error) {
        console.error("Error while getting service request:", error);
        res.status(500).json({ error: "Internal server error while getting service." });
      }
    });
    app.post("/updateService", async (req, res) => {
      const { end_date, payment, service_id, start_date } = req.body;
      console.log("Received service_id:", req.body);
    
      // Validate the inputs
      if (!service_id || !start_date || !end_date || !payment) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
    
      const query = `
        UPDATE service 
        SET start_date = ?, end_date = ?, payment = ?
        WHERE id = ?`;
    
      try {
        // Use a promise-based query for async handling
        const [result] = await db.query(query, [start_date, end_date, payment, service_id]);
    
        if (result.affectedRows > 0) {
          return res.status(200).json({
            success: true,
            message: "Service updated successfully.",
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "Service not found.",
          });
        }
      } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the service.",
        });
      }
    });
  app.post('/addproduct', async (req, res) => {
    try {
      const { name, image, salary  } = req.body;
  
      if (!name || !image || !salary) {
        return res.status(400).json({ message: "All fields are required." });//oblicatoire
      }
  
      const query1 = "SELECT * FROM product WHERE name = ?";
      const [row] = await db.query(query1, [name]);

  
      if (row.length > 0) {
        return res.status(409).json({
          success: false,
          
          message: "Product already exists." });
      }
     
  
      await db.query(
        "INSERT INTO product (name, image, price) VALUES (?, ?, ?)",
        [name, image, salary]
      );
  
      res.status(201).json({ 
        success: true,
        
        message: "Service added successfully." });
    } catch (error) {
      console.error("Error while adding service request:", error);
      res.status(500).json({ error: "Internal server error while adding service." });
    }
  })

  
  app.get("/getorders", async (req, res) => {
    const query = `
      SELECT 
        o.id AS order_id,
        o.order_status,
        o.date,
        op.quantity,
        op.price_product,
        p.name AS product_name,
        p.image AS product_image
      FROM 
        \`order\` o
      JOIN 
        order_product op ON o.id = op.order_id
      JOIN 
        product p ON op.product_id = p.id;
    `;

    try {
        const [orders] = await db.query(query);

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found.",
            });
        }

        const formattedOrders = orders.map((order) => ({
            ...order,
            date: new Date(order.date).toLocaleDateString(),
        }));

        res.status(200).json({
            success: true,
            data: formattedOrders,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});

    //button
    app.put("/updateorder", (req, res) => {
      try {
        const { orderId } = req.body; // Make sure orderId is sent in the request body
        console.log("Received orderId:", orderId);
    
        if (!orderId) {
          return res.status(400).json({
            success: false,
            message: "Order ID is required.",
          });
        }
    
        // Query to update the order_status
        const query = `
          UPDATE \`order\`
          SET order_status = 'Completed'
          WHERE id = ?;
        `;
    
        db.query(query, [orderId], (err, result) => {
          if (err) {
            console.error("Error updating order status:", err.message);
            return res.status(500).json({
              success: false,
              message: "Failed to update order status. Please try again later.",
            });
          }
    
          if (result.affectedRows > 0) {
            console.log("Order status updated successfully for ID:", orderId);
            return res.status(200).json({
              success: true,
              message: "Order status updated successfully.",
            });
          } else {
            console.warn("No order found with ID:", orderId);
            return res.status(404).json({
              success: false,
              message: "Order not found.",
            });
          }
        });
      } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
   
app.listen(8081, () => {
  console.log("Server is listening on port 8081...");

});