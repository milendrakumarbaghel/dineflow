# DineFlow — API & WebSocket Documentation

**Base API URL:** `/api/v1`  
**WebSocket URL:** `/ws` (STOMP broker destination prefix: `/topic`)  
**Interactive Swagger UI:** `http://localhost:8080/swagger-ui/index.html` (or `http://localhost:3000/swagger-ui/`)

---

## 1. Authentication & Security

All authenticated endpoints require an `Authorization: Bearer <JWT>` header.  
Public endpoints (QR resolution, public menu, guest queue, service calls) do not require a JWT.

### POST `/api/v1/auth/login`
Authenticate staff or management member.
- **Request Body:**
```json
{
  "email": "owner@emberandolive.com",
  "password": "Password123!"
}
```
- **Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "name": "Ember Admin",
  "email": "owner@emberandolive.com",
  "roles": ["OWNER"],
  "restaurantSlug": "ember-and-olive"
}
```

---

## 2. Public / Guest Endpoints

### GET `/api/v1/public/restaurants/{slug}/qr/{qrToken}/context`
Resolves a scanned table QR code token into the restaurant, dining table, and active session context.
- **Response `200 OK`:**
```json
{
  "restaurant": {
    "id": 1,
    "name": "Ember & Olive",
    "slug": "ember-and-olive",
    "currency": "INR",
    "currencySymbol": "₹"
  },
  "table": {
    "id": 4,
    "tableNumber": "T04",
    "seatsCapacity": 4,
    "status": "OCCUPIED"
  },
  "activeSessionId": 1,
  "sessionCode": "SES-2084",
  "valid": true,
  "message": "Valid table session found"
}
```

### GET `/api/v1/public/restaurants/{slug}/menu`
Returns all active dishes organized with categories, pricing, and modifier groups.

### POST `/api/v1/public/orders`
Places a new order from a customer table or waitlist guest.
- **Request Body:**
```json
{
  "restaurantSlug": "ember-and-olive",
  "destination": "T04",
  "orderType": "DINE_IN",
  "customerName": "Guest at T04",
  "customerPhone": "+91 98765 43210",
  "specialInstructions": "Less spicy please",
  "paymentMode": "UPI",
  "tableSessionId": 1,
  "items": [
    {
      "menuItemId": 1,
      "quantity": 1,
      "spiceLevel": "MEDIUM",
      "instructions": "Extra mint chutney"
    }
  ]
}
```
- **Response `201 Created`:** Order payload with generated `orderNumber` (e.g. `TF-1049`), subtotal, tax amount, and initial status `PLACED`.

### GET `/api/v1/public/orders/{orderNumber}`
Retrieves real-time status, timeline index (`0` Placed, `1` Accepted, `2` Preparing, `3` Ready, `4` Served), and items for a specific order.

### POST `/api/v1/public/queue/join`
Adds a customer party to the digital waitlist.
- **Request Body:**
```json
{
  "restaurantSlug": "ember-and-olive",
  "customerName": "Vikram Malhotra",
  "phone": "+91 98765 43210",
  "partySize": 4,
  "seatingPreference": "Booth or Patio"
}
```
- **Response `201 Created`:**
```json
{
  "ticketToken": "Q-020",
  "customerName": "Vikram Malhotra",
  "partySize": 4,
  "queuePosition": 3,
  "estimatedWaitMinutes": 18,
  "status": "WAITING"
}
```

### GET `/api/v1/public/queue/{ticketToken}`
Returns live waitlist ticket position, status, and assigned table once notified.

### POST `/api/v1/public/queue/{ticketToken}/advance-order`
Submits an advance order attached to a waitlist ticket with holding preference (`HOLD_UNTIL_SEATED` or `COUNTER_NOW`).

### POST `/api/v1/public/service-requests`
Sends a table service request to waitstaff (`CALL_WAITER`, `REQUEST_BILL`, `WATER_REFILL`).

---

## 3. Staff & Operations Endpoints

### GET `/api/v1/staff/tables?slug=ember-and-olive`
Returns all dining tables, active occupancy status, guest count, and genuine ZXing QR code data URLs.

### PATCH `/api/v1/staff/tables/{tableId}/status`
Updates table status (`AVAILABLE`, `OCCUPIED`, `CLEANING`, `RESERVED`).

### POST `/api/v1/staff/tables/{tableId}/start-session`
Initializes a new seated table session with guest name and party size.

### POST `/api/v1/staff/tables/{tableId}/close-session`
Closes a table session and transitions table to `CLEANING`.

### GET `/api/v1/staff/orders?slug=ember-and-olive`
Unified feed of all orders across dine-in, counter pickup, and waitlist advance orders.

### GET `/api/v1/staff/kitchen/orders`
KDS order feed sorted by preparation urgency and age.

### POST `/api/v1/staff/kitchen/orders/{id}/preparing`
Kitchen marks ticket actively preparing.

### POST `/api/v1/staff/kitchen/orders/{id}/ready`
Kitchen marks order ready for pickup/delivery by runners.

### POST `/api/v1/staff/runner/orders/{id}/serve`
Waiter/runner confirms order delivery to guest table.

---

## 4. Billing & Payments

### GET `/api/v1/staff/tables/{tableNumber}/bill`
Retrieves consolidated table bill with subtotal, SGST, CGST, discounts, and split status.

### POST `/api/v1/staff/bills/{billId}/pay`
Records payment (`CASH`, `UPI`, `CARD`, `ONLINE`) with optional split support.

---

## 5. Analytics & Management

### GET `/api/v1/admin/analytics?slug=ember-and-olive&range=today`
Aggregated business intelligence metrics:
- `grossSales`: Total revenue today
- `avgOrderValue`: Average transaction size
- `avgPrepTimeMinutes`: Average kitchen preparation duration
- `tableTurnoverMinutes`: Average table turnover time
- `hourlySales`: Hourly sales distribution for Recharts
- `popularDishes`: Top selling items with volume and percentage

---

## 6. Real-Time WebSocket Topics (STOMP)

DineFlow broadcasts events over STOMP destinations:

| Topic Destination | Event Type | Description |
|---|---|---|
| `/topic/orders` | `ORDER_CREATED`, `ORDER_STATUS_CHANGED` | Broadcasts to KDS, waitstaff, and customer tracking |
| `/topic/queue` | `QUEUE_JOINED`, `QUEUE_NOTIFIED`, `TABLE_ASSIGNED` | Notifies hosts and waitlist guests |
| `/topic/tables` | `TABLE_STATUS_CHANGED`, `SESSION_STARTED`, `SESSION_CLOSED` | Updates live floor plan and host consoles |
| `/topic/service-requests` | `SERVICE_REQUEST_CREATED`, `SERVICE_REQUEST_RESOLVED` | Alerts waiters to customer table calls |
