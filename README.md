# **VahanBazar**

**VahanBazar** is a modern web application for browsing, comparing, and purchasing **new and used two-wheelers**.  
It connects buyers with dealers, offering powerful tools to discover, compare, and make informed decisions.  

---

## 🚀 Project Progress  

### ✅ Overall Progress  
![Progress](https://progress-bar.xyz/80/?title=&width=400&color=5bc0de)
### ✅ Core Features 
![Progress](https://progress-bar.xyz/90/?title=&width=400&color=5ba0de)
### Additional Features  
![Progress](https://progress-bar.xyz/60/?title=&width=400&color=5bc0de)
---

## 🛠️ Tech Stack  

- **Frontend**:  React +  Vite (Modern, fast, responsive UI)  
- **Backend**:  Django + Django REST Framework (API, authentication, business logic)  
- **Database**:  PostgreSQL (Structured relational storage)  
- JSON for dynamic specs/features, REST APIs for communication  

---

## ✨ Core Features  

- ✅ **Listings**: Browse new bikes, scooters, and EVs with images, price, and details.
- ✅ **Search & Filters**: By **brand, price, fuel type**, etc.  
- ✅ **Product Page**: View detailed specs, multiple images, offers, and on-road price.  
- ✅ **Side-by-Side Comparison**: Compare multiple models.  
- ✅ **Finance Tools**: EMI Calculator (Fuel Cost Calculator upcoming).  
- ✅ **Used Listings**: By both **dealers** and **individual users**.  
- ✅ **Showrooms & Test Rides**: Dealer directory and booking form.
- 🟡 **Upcoming Launches**: Expected models with launch timeline. (Backend Implemented)

---

## 📦 Additional Features  

- ✅ **Authentication**: Login & signup with buyer/dealer roles.  
- ✅ **Wishlist**: Save vehicles for later.  
- ⬜ **Reviews & Ratings**: Leave feedback on vehicles.  
- ⬜ **Price Alerts**: Get notified about price drops.  
- ✅ **Dealer Dashboard**: Manage dealer listings and inventory.  
- ⬜ **Recommendation Engine**: AI-powered personalized suggestions.  

---

## ScreenShots

<table>
  <tr>
    <td align="center">
      <b>New Vehicle Listings</b><br>
      <img src="/screenshots/new_vehicles.png" height="200" width="400"/>
    </td>
    <td align="center">
      <b>Vehicle Detail Page</b><br>
      <img src="/screenshots/vehicle_detail.png" height="200" />
    </td>
    <td align="center">
      <b>EMI Calculator</b><br>
      <img src="/screenshots/emi_calculator.png" height="200" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Compare Side by Side</b><br>
      <img src="/screenshots/compare_side_by_side.png" height="200" />
    </td>
    <td align="center">
      <b>Used Vehicle Listings</b><br>
      <img src="/screenshots/used_vehicles.png" height="200" width="400"/>
    </td>
    <td align="center">
      <b>Landing Page - Hero Section</b><br>
      <img src="/screenshots/landing_page.png" height="200" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Dealer - Vehicle Listing</b><br>
      <img src="/screenshots/dealer_listings.png" height="200" />
    </td>
    <td align="center">
      <b>Dealer - Branches</b><br>
      <img src="/screenshots/dealer_branches.png" height="200" width="400"/>
    </td>
    <td align="center">
      <b>Dealer - Profile</b><br>
      <img src="/screenshots/dealer_profile.png" height="200" width="400"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Customer - Used Vehicle Listings</b><br>
      <img src="/screenshots/customer_used_vehicles_list.png" height="200" />
    </td>
    <td align="center">
      <b>Customer - Used Vehicle Add</b><br>
      <img src="/screenshots/customer_used_vehicle_add.png" height="200" width="400"/>
    </td>
    <td align="center">
      <b>Customer - Used Vehicle Detail</b><br>
      <img src="/screenshots/cutomer_used_vehicle_detail.png" height="200" width="400"/>
    </td>
  </tr>
</table>

## API Reference

### Authentication

#### User Registration

```
  POST /api/auth/register/
```

Creates a new user account. Can also be used to create a dealer account by setting `is_dealer` to `true` and providing dealership and branch details.

**Headers**
- `Content-Type: application/json`

**Request Body**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword123",
  "is_dealer": false,
  "dealership": {
    "name": "My Awesome Dealership",
    "description": "The best bikes in town."
  },
  "branch": {
    "name": "Main Branch",
    "address": "123 Bike Lane",
    "city": "Cycleville",
    "state": "Bikeland",
    "contact_number": "1234567890"
  }
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `username` | `string` | **Required**. |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |
| `is_dealer`| `boolean`| Defaults to `false`. If `true`, `dealership` and `branch` are required. |
| `dealership`| `object`| Required if `is_dealer` is `true`. |
| `branch` | `object` | Required if `is_dealer` is `true`. |


#### User Login

```
  POST /api/auth/login/
```

Authenticates a user and returns an access and refresh token.

**Headers**
- `Content-Type: application/json`

**Request Body**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `username` | `string` | **Required**. The user's username. |
| `password` | `string` | **Required**. The user's password. |

### Vehicles

#### Get All Vehicles

```
  GET /api/vehicles/
```

This endpoint retrieves a list of all available vehicles. It supports filtering.

**Query Parameters**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `brand` | `string` | Filter by brand name. |
| `price__gt` | `number` | Filter by price greater than a value. |
| `price__lt` | `number` | Filter by price less than a value. |


#### Get Vehicle Details

```
  GET /api/vehicles/${id}/
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. ID of the vehicle to fetch. |

#### Create Vehicle

```
  POST /api/vehicles/
```

Creates a new vehicle. This endpoint is for `multipart/form-data`. The main data should be passed as a JSON string in a form field named `data`, and images should be passed as files in a form field named `images`. At least 3 images are required.

**Authentication**
- Required: `Bearer <your_access_token>`

**Form Data**

-   `data`: (string, required) A JSON string containing the vehicle details.
-   `images`: (file, required) At least 3 image files.

**`data` JSON object fields:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | **Required**. The name of the vehicle model. |
| `brand` | `integer` | **Required**. The ID of the brand. |
| `price` | `number` | **Required**. The price of the vehicle. |
| `category` | `string` | **Required**. E.g., 'BIKE', 'SCOOTER'. |
| `type` | `string` | **Required**. 'NEW' or 'USED'. |
| `branch` | `integer` | Required for 'NEW' vehicles. The ID of the dealer branch. |
| `specs` | `object` | **Required**. A JSON object with vehicle specifications. |
| `fuel_type` | `string` | E.g., 'PETROL', 'ELECTRIC'. |
| `status` | `string` | E.g., 'AVAILABLE', 'SOLD'. |
| `is_featured` | `boolean` | `true` to feature the vehicle. |
| `discount_type` | `string` | E.g., 'PERCENTAGE', 'FIXED'. |
| `discount_value` | `number` | The value of the discount. |
| `discount_description` | `string` | A description of the discount. |
| `model_name` | `string` | The specific model name/year. |
| `variant` | `object` or `integer` | Can be a new variant object or the ID of an existing variant. |
| `year` | `integer` | Required for 'USED' vehicles. |
| `km_driven` | `integer` | Required for 'USED' vehicles. |
| `condition` | `string` | Required for 'USED' vehicles. E.g., 'GOOD', 'EXCELLENT'. |
| `exchange_offer` | `boolean` | `true` if an exchange offer is available. |
| `loan_option` | `boolean` | `true` if a loan option is available. |

**Example `data` object:**
```json
{
    "name": "CB Shine",
    "brand": 1,
    "price": 85000,
    "category": "BIKE",
    "type": "NEW",
    "branch": 1,
    "specs": {
        "engine": "125cc",
        "mileage": "65 kmpl"
    },
    "fuel_type": "PETROL",
    "model_name": "2025 Edition"
}
```

#### Update Vehicle

```
  PUT /api/vehicles/${id}/
  PATCH /api/vehicles/${id}/
```

Updates an existing vehicle. The request format is the same as creating a vehicle (`multipart/form-data`).

**Authentication**
- Required: `Bearer <your_access_token>`

**URL Parameters**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. The ID of the vehicle to update. |

**Form Data**
-   `data`: (string, required) A JSON string with the vehicle fields to update.
-   `images`: (file) New images for the vehicle. If provided, existing images will be replaced.

### Wishlist

#### Get Wishlist

```
  GET /api/wishlist/
```

Retrieves the wishlist for the currently authenticated user.

**Headers**
- `Authorization: Bearer <your_access_token>`

#### Add to Wishlist

```
  POST /api/wishlist/
```

Adds a vehicle to the user's wishlist.

**Headers**
- `Authorization: Bearer <your_access_token>`
- `Content-Type: application/json`

**Request Body**
```json
{
  "vehicle_id": 1
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `vehicle_id` | `integer` | **Required**. The ID of the `VehicleModel` to add to the wishlist. |

### Bookings

#### Get User Bookings

```
  GET /api/bookings/
```

Retrieves a list of bookings made by the authenticated user.

**Headers**
- `Authorization: Bearer <your_access_token>`

#### Create a Booking

```
  POST /api/bookings/
```

Creates a new booking for a test ride or a vehicle.

**Headers**
- `Authorization: Bearer <your_access_token>`
- `Content-Type: application/json`

**Request Body**
```json
{
  "inventory_item": 1,
  "branch": 1,
  "booking_type": "Test-Ride",
  "preferred_date": "2025-12-25",
  "preferred_time": "14:30"
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `inventory_item` | `integer` | **Required**. The ID of the inventory item. |
| `branch` | `integer` | **Required**. The ID of the branch. |
| `booking_type` | `string` | **Required**. E.g., "Test-Ride", "Purchase". |
| `preferred_date` | `string` | **Required**. In `YYYY-MM-DD` format. |
| `preferred_time` | `string` | **Required**. In `HH:MM` format. |

### Dealer

#### Get Dealer Dashboard

```
  GET /api/dealer/dashboard/
```

Retrieves dashboard information for the authenticated dealer.

**Headers**
- `Authorization: Bearer <your_access_token>`
