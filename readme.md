Basic Setup of express js 
==========================

-> first create a simple package.json file 
  =====> Command --->  npm init -y 
-> Required Dependencies  
  - express
  - mongoose 
  - dotenv 
  - nodemon 

  npm i express mongoose dotenv nodemon

=> Create a file named .env (environment files ) -> always put it in gitignore file (ye vo file h jo github par push nahi hogi)


=> 1. User Management Routes 

 - POST /users/register: Registers a new user.
 - POST /users/login: Authenticates a user and returns a token.
 - GET /users/profile: Retrieves the logged-in user's profile details.
 - PUT /users/profile: Updates the logged-in user's profile information.
 - DELETE /users/profile: Deletes the logged-in user's account.
 - POST /users/logout: Logs out a user by terminating the session or token.

2. Product Management Routes
 
 - POST /products: Adds a new product.
 - GET /products: Retrieves all products, possibly with pagination and filtering capabilities (e.g., by category, price range).
 - GET /products/:productId: Gets details of a specific product.
 - PUT /products/:productId: Updates specific product details.
 - DELETE /products/:productId: Removes a product from the listing.
 - GET /products/search: Searches products based on keywords.

3. Order Management Routes 

 - POST /orders: Creates a new order.
 - GET /orders: Retrieves all orders for an admin or seller (filtered access).
 - GET /orders/:orderId: Retrieves details of a specific order.
 - PUT /orders/:orderId: Updates an order's status (e.g., processing, shipped, delivered, cancelled).
 - DELETE /orders/:orderId: Cancels an existing order.

4. Seller Management Routes

 - POST /sellers/register: Registers a new seller.
 - POST /sellers/login: Logs in a seller and returns a token.
 - GET /sellers/profile: Retrieves the logged-in seller's profile.
 - PUT /sellers/profile: Updates the logged-in seller's profile information.
 - DELETE /sellers/profile: Deletes a seller's account.
 - GET /sellers/products: Retrieves all products listed by the logged-in seller.

5. Review and Rating Routes

 - POST /products/:productId/reviews: Adds a review for a specific product.
 - GET /products/:productId/reviews: Gets all reviews for a specific product.
 - DELETE /reviews/:reviewId: Deletes a specific review (by the review's author or admin).

6. Analytics and Reporting Routes

 - GET /analytics/sales: Retrieves sales data across various dimensions (time, product, seller).
 - GET /analytics/users: Provides analytics on user engagement and demographics.

7. Authentication and Security Routes

 - POST /auth/refresh: Refreshes an expired token.
 - POST /auth/validate: Validates a token's current status.

8. Miscellaneous Routes

 - POST /notifications: Sends notifications to users or sellers.
 - GET /settings: Retrieves platform settings.
 - PUT /settings: Updates platform settings.


9. Integration Routes

 - POST /payments/make: Processes payments through integrated payment gateways.
 - POST /shipping/dispatch: Handles shipping through integrated shipping providers.