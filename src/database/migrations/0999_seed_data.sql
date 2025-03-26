-- First, insert roles to ensure they exist before user creation
INSERT INTO "public"."roles" ("id", "name") VALUES
(1, 'user'),
(2, 'admin'),
(3, 'experts');

-- Then insert users
INSERT INTO "public"."users" ("id", "name", "email", "password", "role_id", "created_at", "updated_at", "email_verified", "account_status") VALUES
(1, 'Dr. Sarah Johnson', 'sarah.johnson@example.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(2, 'Prof. Michael Chen', 'michael.chen@example.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(3, 'Dr. Emily Rodriguez', 'emily.rodriguez@example.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(4, 'Dr. James Wilson', 'james.wilson@example.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(5, 'Dr. Lisa Thompson', 'lisa.thompson@example.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(6, 'Nghia', 'hoangvananhnghia@gmail.com', '9283755640a9a6cb027bfd520b49e0f8206052f003df74bad2732f07a954f851', 1, '2025-03-05 16:28:08.04399', '2025-03-05 16:28:08.04399', 'f', 'active'),
(7, 'Nghia', 'hoangvananhnhgia@gmail.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 1, '2025-03-13 06:32:22.942066', '2025-03-13 06:32:22.942066', 'f', 'active');

-- Next, insert user profiles
INSERT INTO "public"."user_profiles" ("id", "user_id", "bio", "phone", "address", "city", "state", "country", "postal_code", "profile_image", "preferences", "social_links", "created_at", "updated_at") VALUES
(1, 1, 'Licensed marriage counselor with 10+ years of experience helping couples build stronger relationships.', '(555) 123-4567', '123 Harmony Lane', 'Seattle', 'WA', 'USA', '98101', 'https://randomuser.me/api/portraits/women/1.jpg', '{"theme": "light", "language": "en", "notification_preferences": {"sms": true, "email": true}}', '{"twitter": "twitter.com/counselor1", "linkedin": "linkedin.com/in/counselor1"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406'),
-- ... (rest of the user_profiles data)
(6, 6, 'Marriage of 15 years, working through trust issues and seeking to rebuild our connection.', '(555) 678-9012', '303 Renewal Drive', 'Austin', 'TX', 'USA', '78701', 'https://randomuser.me/api/portraits/women/6.jpg', '{"theme": "light", "language": "en", "notification_preferences": {"sms": true, "email": false}}', '{"facebook": "facebook.com/client3"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406');

-- Then insert experts (depends on users)
INSERT INTO "public"."experts" ("id", "user_id", "title", "location", "experience", "specialties", "availability_status", "about", "google_meet_link") VALUES
(1, 1, 'Clinical Psychologist', 'New York, NY', 12.5, '["Anxiety", "Depression", "Cognitive Behavioral Therapy"]', 'online', 'Experienced clinical psychologist specializing in anxiety and depression treatment using evidence-based approaches.', 'https://meet.google.com/abc-defg-hij'),
-- ... (rest of the experts data)
(5, 5, 'Business Consultant', 'Austin, TX', 9.5, '["Strategic Planning", "Start-ups", "Digital Transformation"]', 'online', 'Strategic business consultant specializing in helping startups and digital transformation initiatives.', 'https://meet.google.com/efg-hijk-lmn');

-- Insert expert-related information
INSERT INTO "public"."expert_education" ("id", "expert_id", "degree", "institution", "year", "created_at", "updated_at") VALUES
(1, 1, 'Ph.D. in Clinical Psychology', 'Stanford University', '2010', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
-- ... (rest of the expert_education data)
(7, 5, 'MBA in Business Strategy', 'Northwestern University', '2014', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885');

INSERT INTO "public"."expert_certifications" ("id", "expert_id", "name", "issuer", "year", "expiry_date", "created_at", "updated_at") VALUES
(1, 1, 'Licensed Clinical Psychologist', 'New York State Board', '2011', '2025-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
-- ... (rest of the expert_certifications data)
(5, 5, 'Project Management Professional (PMP)', 'Project Management Institute', '2019', '2025-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885');

-- Insert expert services
INSERT INTO "public"."expert_services" ("id", "expert_id", "name", "duration", "price", "description", "created_at", "updated_at") VALUES
(1, 1, 'Individual Therapy Session', '50 minutes', 150, 'One-on-one therapy session focused on your specific needs and goals.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
-- ... (rest of the expert_services data)
(6, 5, 'Business Strategy Consultation', '90 minutes', 250, 'In-depth business analysis and strategic planning session.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885');

-- Insert expert availability
INSERT INTO "public"."expert_availability" ("id", "expert_id", "day_of_week", "start_time", "end_time", "is_available", "created_at", "updated_at") VALUES
(1, 1, 'monday', '09:00:00', '17:00:00', 't', '2025-03-06 07:49:42.908848', '2025-03-06 07:49:42.908848'),
-- ... (rest of the expert_availability data)
(27, 5, 'sunday', '11:00:00', '17:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838');

-- Insert appointments
INSERT INTO "public"."appointments" ("id", "expert_id", "user_id", "scheduled_time", "status", "service_id", "end_time", "notes", "created_at", "updated_at") VALUES
(1, 1, 6, '2025-11-03 02:00:00', 'canceled', 1, '2025-11-03 02:50:00', 'Hello', '2025-03-11 06:51:26.938651', '2025-03-18 19:20:55.509'),
-- ... (rest of the appointments data)
(14, 2, 6, '2025-03-26 10:00:00', 'pending', 3, '2025-03-26 11:00:00', 'Hello', '2025-03-20 03:33:18.12526', '2025-03-20 03:33:18.12526');

-- Insert payments
INSERT INTO "public"."payments" ("id", "user_id", "amount", "created_at", "updated_at", "expert_id", "status", "payment_method", "appointment_id", "payos_order_id") VALUES
(1, 6, 3750000, '2025-03-13 03:25:21.967748', '2025-03-13 03:25:21.967748', 1, 'pending', 'payos', 1, '321585'),
-- ... (rest of the payments data)
(11, 6, 200000, '2025-03-20 03:33:21.602073', '2025-03-20 03:33:21.602073', 2, 'pending', 'payos', 14, '741734938');