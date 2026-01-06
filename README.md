Technical Architecture
Backend (Node.js + Express)
Framework: Express.js with RESTful API architecture
Database: MongoDB with Mongoose ODM
Real-time Communication: Socket.IO for live updates and location tracking
Authentication: JWT (JSON Web Tokens) with dual support for:
Authorization headers (Bearer <token>)
HTTP-only cookies for enhanced security
Security Features:
Bcrypt password hashing (10 salt rounds)
Token blacklisting for logout functionality
Input validation using express-validator
CORS configuration for cross-origin requests
API Documentation: Swagger (swagger-jsdoc + swagger-ui-express)
Map Integration: Mapbox API for geocoding and route calculations
Frontend (React + Vite)
Framework: React 19 with React Router DOM for navigation
Build Tool: Vite for fast development and optimized builds
Styling: Tailwind CSS 4 with custom components
Animations: GSAP for smooth UI transitions
Map Rendering: React Map GL (Mapbox GL wrapper)
Real-time: Socket.IO client for live ride updates
State Management: React Context API for user and captain authentication
HTTP Client: Axios for API communication
Core Features
User Features
Authentication System
Registration with email, password, and full name
Secure login with JWT tokens
Protected routes with authentication middleware
Logout with token blacklisting
Ride Booking Flow
Search for pickup and destination addresses
View estimated fare, distance, and duration
Select vehicle type (car, motorcycle, auto)
Real-time ride status updates (pending → accepted → ongoing → completed)
Live tracking of captain's location during ride
OTP verification for ride confirmation
Payment processing upon ride completion
Real-time Updates
Socket-based notifications when captain accepts ride
Live location tracking of captain en route
Ride status updates (confirmed, started, completed)
Interactive map with live markers
Captain (Driver) Features
Authentication & Profile
Registration with vehicle details (color, plate, capacity, type)
Login with captain credentials
Profile management
Ride Management
Receive real-time ride requests
View ride details (pickup, destination, fare, user info)
Accept/reject ride requests
OTP validation before starting ride
Real-time navigation to pickup and destination
Location broadcasting to users
Complete rides and process payments
Status management (active/inactive)
Live Tracking
Continuous location updates via Socket.IO
Automatic status changes on connection/disconnection
Route visualization with Mapbox
Data Models
User Model
Full name (firstname, lastname)
Email (unique)
Password (hashed)
Socket ID for real-time communication
Current location (lat, lng)
Captain Model
Full name (firstname, lastname)
Email (unique)
Password (hashed)
Vehicle details (color, plate, capacity, type)
Socket ID
Current location (lat, lng)
Status (active/inactive)
Ride Model
User reference
Captain reference (assigned after acceptance)
Pickup/destination addresses
Fare, distance, duration
Status (pending, accepted, ongoing, completed, cancelled)
OTP for verification
Payment details (paymentID, orderID, signature)
Blacklist Token Model
Token (blacklisted JWT)
Created timestamp with 24-hour TTL
Key Technical Implementations
Socket.IO Events
join: Register user/captain socket connection
update-location-captain: Track captain's real-time location
update-location-user: Track user's location
new-ride: Notify captains of new ride requests
ride-confirmed: Notify user when captain accepts ride
ride-started: Notify user when captain starts ride
ride-ended: Complete ride and trigger payment
API Endpoints
Users: /users/register, /login, /profile, /logout
Captains: /captains/register, /login, /profile, /logout
Rides: /rides/create, /get-fare, /confirm, /start-ride, /end-ride
Maps: /maps/get-coordinates, /get-distance-time, /get-suggestions

Frontend Pages
Start page, User/Captain login and signup
User home (ride booking interface)
Captain home (ride request dashboard)
Riding pages for active trips
Protected route wrappers
Frontend Components
VehiclePanel, LookingForDriver, WaitingForDriver
ConfirmRidePopUp, RidePopUp, FinishRide, RidePayment
LiveTracking, LocationSearchPanel, CaptainDetails
Development Setup
Backend: Node.js server on port 4000 with nodemon for hot-reloading
Frontend: Vite dev server with HMR (Hot Module Replacement)
Environment Variables: MongoDB URI, JWT secret, Mapbox API key
Package Management: npm with lock files for consistent dependencies
