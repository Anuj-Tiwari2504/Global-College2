# Global Institute Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/global_institute
JWT_SECRET=your_jwt_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-photo` - Upload profile photo

### Fee Management
- `GET /api/fees/structure` - Get fee structure
- `GET /api/fees/payments` - Get payment history
- `POST /api/fees/pay` - Process payment
- `GET /api/fees/status` - Get payment status

### Support System
- `POST /api/support/ticket` - Create support ticket
- `GET /api/support/tickets` - Get user tickets
- `GET /api/support/ticket/:ticketId` - Get specific ticket
- `POST /api/support/ticket/:ticketId/response` - Add response
- `PUT /api/support/ticket/:ticketId/status` - Update ticket status

## Database Models

### User
- Student ID (auto-generated)
- Personal information
- Course details
- Authentication data

### FeePayment
- Payment transactions
- Semester-wise tracking
- Payment method details

### SupportTicket
- Ticket management
- Category and priority
- Response tracking

## Features

✅ JWT Authentication  
✅ Password hashing with bcrypt  
✅ File upload for profile photos  
✅ Input validation  
✅ Error handling  
✅ CORS enabled  
✅ MongoDB integration  
✅ RESTful API design