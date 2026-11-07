-- =======================================================================
-- DineFlow V2__seed_demo_data.sql: Ember & Olive Baseline Data
-- =======================================================================

-- 1. Insert Restaurant & Settings
INSERT INTO restaurants (id, name, slug, description, logo_url, currency, currency_symbol, timezone, is_active)
VALUES (1, 'Ember & Olive', 'ember-and-olive', 'Artisan Woodfired Kitchen & Botanicals', '/assets/logo.png', 'INR', '₹', 'Asia/Kolkata', TRUE);

INSERT INTO restaurant_settings (restaurant_id, allow_qr_ordering, allow_counter_pickup, require_staff_acceptance, allow_order_cancellation, no_show_grace_minutes, seating_strategy, advance_order_policy, default_tax_rate, service_charge_rate)
VALUES (1, TRUE, TRUE, TRUE, FALSE, 5, 'FIFO_CAPACITY_FIT', 'AFTER_SEATING_DEFAULT', 5.00, 0.00);

-- 2. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'OWNER', 'Full restaurant ownership and financial oversight'),
(2, 'MANAGER', 'Operations, staff, menu, tables, and analytics management'),
(3, 'HOST', 'Front of house, waitlist, guest check-in, and table seating'),
(4, 'KITCHEN', 'Kitchen display system, ticket preparation, and dish readiness'),
(5, 'WAITER', 'Runner, table service, customer requests, and order handoff'),
(6, 'CASHIER', 'Billing desk, invoice settlement, and payment tracking');

-- 3. Insert Users & Staff Memberships (password: password123, BCrypt $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a)
INSERT INTO users (id, email, password_hash, full_name, phone, is_active) VALUES
(1, 'owner@emberandolive.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Ananya Rao', '+91 98765 00001', TRUE),
(2, 'manager@emberandolive.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Vikram Seth', '+91 98765 00002', TRUE),
(3, 'kitchen@emberandolive.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Dev Patel', '+91 98765 00003', TRUE),
(4, 'waiter@emberandolive.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Meera Singh', '+91 98765 00004', TRUE),
(5, 'host@emberandolive.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Kabir Joshi', '+91 98765 00005', TRUE),
(6, 'cashier@emberandolive.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Rohan Das', '+91 98765 00006', TRUE);

INSERT INTO restaurant_memberships (restaurant_id, user_id, role_id, title, is_active) VALUES
(1, 1, 1, 'Restaurateur & Founder', TRUE),
(1, 2, 2, 'General Manager', TRUE),
(1, 3, 4, 'Executive Chef', TRUE),
(1, 4, 5, 'Head Captain', TRUE),
(1, 5, 3, 'Front of House Lead', TRUE),
(1, 6, 6, 'Billing Supervisor', TRUE);

-- 4. Dining Area & Tables
INSERT INTO dining_areas (id, restaurant_id, name, description) VALUES
(1, 1, 'Main Dining Hall', 'Spacious ground floor artisan dining space');

INSERT INTO dining_tables (id, restaurant_id, area_id, table_number, seats_capacity, status, current_guest_note) VALUES
(1, 1, 1, 'T01', 2, 'OCCUPIED', '2 guests'),
(2, 1, 1, 'T02', 4, 'OCCUPIED', '3 guests'),
(3, 1, 1, 'T03', 2, 'AVAILABLE', 'Ready to seat'),
(4, 1, 1, 'T04', 4, 'OCCUPIED', 'Your table · 3 guests'),
(5, 1, 1, 'T05', 6, 'CLEANING', 'Needs reset'),
(6, 1, 1, 'T06', 4, 'OCCUPIED', '2 guests'),
(7, 1, 1, 'T07', 2, 'RESERVED', 'Reservation 7:30'),
(8, 1, 1, 'T08', 4, 'AVAILABLE', 'Ready to seat');

-- 5. Table QR Tokens
INSERT INTO table_qr_tokens (table_id, token_value, token_hash, is_revoked) VALUES
(1, 'token-t01-8k2a', 'hash-t01', FALSE),
(2, 'token-t02-4m9p', 'hash-t02', FALSE),
(3, 'token-t03-7n2q', 'hash-t03', FALSE),
(4, 'token-t04-9x7b', 'hash-t04', FALSE),
(5, 'token-t05-3w8r', 'hash-t05', FALSE),
(6, 'token-t06-6p1s', 'hash-t06', FALSE),
(7, 'token-t07-2v5t', 'hash-t07', FALSE),
(8, 'token-t08-5z3u', 'hash-t08', FALSE);

-- 6. Table Session for T04
INSERT INTO table_sessions (id, restaurant_id, table_id, session_code, guest_name, guest_count, status, started_at)
VALUES (1, 1, 4, 'SES-2084', 'Aarav Sharma', 3, 'ACTIVE', CURRENT_TIMESTAMP);

-- 7. Menu Categories
INSERT INTO menu_categories (id, restaurant_id, name, display_order, is_active) VALUES
(1, 1, 'Starters', 1, TRUE),
(2, 1, 'Mains', 2, TRUE),
(3, 1, 'Healthy', 3, TRUE),
(4, 1, 'Drinks', 4, TRUE),
(5, 1, 'Desserts', 5, TRUE);

-- 8. Menu Items
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, emoji, image_url, tag, is_available, prep_time_minutes, spice_level, is_vegetarian) VALUES
(1, 1, 1, 'Smoky Paneer Tikka', 'Charred cottage cheese · mint yoghurt · pickled onion', 289.00, '🍢', '/assets/dishes/paneer.jpg', 'Chef favourite', TRUE, 18, 'MEDIUM', TRUE),
(2, 1, 2, 'Ghee Roast Dosa', 'Crisp fermented crepe · potato masala · sambar', 219.00, '🥞', '/assets/dishes/dosa.jpg', 'Bestseller', TRUE, 14, 'MILD', TRUE),
(3, 1, 2, 'Dum Veg Biryani', 'Aged basmati · saffron · slow-cooked vegetables', 329.00, '🍛', '/assets/dishes/biryani.jpg', 'Popular', TRUE, 22, 'MEDIUM', TRUE),
(4, 1, 2, 'Creamy Pesto Pasta', 'Basil pesto · parmesan · toasted pine nuts', 349.00, '🍝', '/assets/dishes/pasta.jpg', '', TRUE, 16, 'MILD', TRUE),
(5, 1, 3, 'Garden Crunch Bowl', 'Seasonal greens · citrus dressing · seeds', 249.00, '🥗', '/assets/dishes/salad.jpg', 'Fresh', TRUE, 10, 'MILD', TRUE),
(6, 1, 4, 'Cold Brew Float', '18-hour cold brew · vanilla cream · ice', 179.00, '🥤', '/assets/dishes/coffee.jpg', '', TRUE, 5, 'MILD', TRUE),
(7, 1, 4, 'Mint Lime Cooler', 'Fresh lime · crushed mint · sparkling soda', 139.00, '🍹', '/assets/dishes/lime.jpg', '', TRUE, 5, 'MILD', TRUE),
(8, 1, 5, 'Baked Cheesecake', 'Vanilla bean · berry compote · biscuit crumb', 229.00, '🍰', '/assets/dishes/cheesecake.jpg', 'Sweet finish', TRUE, 6, 'MILD', TRUE);

-- 9. Modifier Groups & Options
INSERT INTO modifier_groups (id, restaurant_id, name, is_required, min_selection, max_selection) VALUES
(1, 1, 'Spice Level', FALSE, 0, 1),
(2, 1, 'Add-ons', FALSE, 0, 2);

INSERT INTO modifier_options (id, group_id, name, price_delta, is_available) VALUES
(1, 1, 'Mild', 0.00, TRUE),
(2, 1, 'Medium', 0.00, TRUE),
(3, 1, 'Hot', 0.00, TRUE),
(4, 2, 'Extra dip', 25.00, TRUE),
(5, 2, 'Extra portion', 45.00, TRUE);

INSERT INTO menu_item_modifier_groups (menu_item_id, modifier_group_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 2),
(3, 1), (3, 2),
(4, 2);

-- 10. Sample Orders
INSERT INTO orders (id, restaurant_id, table_session_id, order_number, order_type, destination, customer_name, status, hold_for_seating, subtotal, tax_amount, total_amount, payment_status, payment_mode) VALUES
(1, 1, 1, 'TF-1045', 'DINE_IN', 'T01', 'Ankit', 'READY', FALSE, 249.00, 12.45, 261.45, 'PAID', 'UPI'),
(2, 1, NULL, 'TF-1046', 'COUNTER_PICKUP', 'PICKUP', 'Sneha', 'READY', FALSE, 578.00, 28.90, 606.90, 'PAID', 'CARD'),
(3, 1, NULL, 'TF-1047', 'DINE_IN', 'T06', 'Rahul', 'PLACED', FALSE, 687.00, 34.35, 721.35, 'PENDING', 'PAY_AT_TABLE'),
(4, 1, 1, 'TF-1048', 'DINE_IN', 'T02', 'Priya', 'PREPARING', FALSE, 577.00, 28.85, 605.85, 'PENDING', 'UPI');

INSERT INTO order_items (id, order_id, menu_item_id, item_name_snapshot, unit_price_snapshot, quantity, spice_level, total_price) VALUES
(1, 1, 5, 'Garden Crunch Bowl', 249.00, 1, 'MILD', 249.00),
(2, 2, 1, 'Smoky Paneer Tikka', 289.00, 2, 'MEDIUM', 578.00),
(3, 3, 3, 'Dum Veg Biryani', 329.00, 1, 'MEDIUM', 329.00),
(4, 3, 6, 'Cold Brew Float', 179.00, 2, 'MILD', 358.00),
(5, 4, 2, 'Ghee Roast Dosa', 219.00, 2, 'MILD', 438.00),
(6, 4, 7, 'Mint Lime Cooler', 139.00, 1, 'MILD', 139.00);

-- 11. Queue Tickets
INSERT INTO queue_tickets (id, restaurant_id, ticket_token, customer_name, customer_phone, party_size, seating_preference, status, estimated_wait_minutes) VALUES
(1, 1, 'Q-016', 'Riya Mehta', '+91 98765 11016', 2, 'INDOOR', 'WAITING', 8),
(2, 1, 'Q-017', 'Kabir Shah', '+91 98765 11017', 4, 'ANY', 'WAITING', 12),
(3, 1, 'Q-018', 'Aarav Sharma', '+91 98765 11018', 3, 'ANY', 'WAITING', 15),
(4, 1, 'Q-019', 'Nisha Rao', '+91 98765 11019', 2, 'OUTDOOR', 'WAITING', 18);

-- 12. Sample Bill for Table T04
INSERT INTO bills (id, restaurant_id, table_session_id, bill_number, subtotal, tax_amount, service_charge, discount_amount, total_due, status, split_count) VALUES
(1, 1, 1, 'B-2048', 647.00, 32.35, 0.00, 0.00, 679.35, 'UNPAID', 1);

-- 13. Service Request
INSERT INTO service_requests (id, restaurant_id, table_id, table_session_id, table_number, request_type, status) VALUES
(1, 1, 4, 1, 'T04', 'REQUEST_BILL', 'PENDING');
