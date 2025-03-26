
-- Users Table
INSERT INTO "public"."users" ("id", "name", "email", "password", "role_id", "created_at", "updated_at", "email_verified", "account_status") VALUES
(1, 'Dr. Sarah Johnson', 'sarah.johnson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(2, 'Prof. Michael Chen', 'michael.chen@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(3, 'Dr. Emily Rodriguez', 'emily.rodriguez@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(4, 'Dr. James Wilson', 'james.wilson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(5, 'Dr. Lisa Thompson', 'lisa.thompson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3, '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885', 'f', 'active'),
(6, 'Nghia', 'hoangvananhnghia@gmail.com', '9283755640a9a6cb027bfd520b49e0f8206052f003df74bad2732f07a954f851', 1, '2025-03-05 16:28:08.04399', '2025-03-05 16:28:08.04399', 'f', 'active'),
(7, 'Nghia', 'hoangvananhnhgia@gmail.com', '40c821eb9633bbb42c44af27ac608f749479ee4b11f1fc687d679c1adee9c080', 1, '2025-03-13 06:32:22.942066', '2025-03-13 06:32:22.942066', 'f', 'active');

-- User Profiles Table
INSERT INTO "public"."user_profiles" ("id", "user_id", "bio", "phone", "address", "city", "state", "country", "postal_code", "profile_image", "preferences", "social_links", "created_at", "updated_at") VALUES
(1, 1, 'Licensed marriage counselor with 10+ years of experience helping couples build stronger relationships.', '(555) 123-4567', '123 Harmony Lane', 'Seattle', 'WA', 'USA', '98101', 'https://randomuser.me/api/portraits/women/1.jpg', '{"theme": "light", "language": "en", "notification_preferences": {"sms": true, "email": true}}', '{"twitter": "twitter.com/counselor1", "linkedin": "linkedin.com/in/counselor1"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406'),
(2, 2, 'Relationship expert specializing in communication issues and conflict resolution techniques.', '(555) 234-5678', '456 Connection Avenue', 'Portland', 'OR', 'USA', '97201', 'https://randomuser.me/api/portraits/men/2.jpg', '{"theme": "dark", "language": "en", "notification_preferences": {"sms": false, "email": true}}', '{"linkedin": "linkedin.com/in/counselor2", "instagram": "instagram.com/counselor2"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406'),
(3, 3, 'Family therapist with expertise in blended families and parenting challenges.', '(555) 345-6789', '789 Unity Street', 'San Francisco', 'CA', 'USA', '94105', 'https://randomuser.me/api/portraits/women/3.jpg', '{"theme": "light", "language": "es", "notification_preferences": {"sms": true, "email": true}}', '{"facebook": "facebook.com/counselor3", "linkedin": "linkedin.com/in/counselor3"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406'),
(4, 4, 'Seeking guidance on improving communication with my partner of 5 years.', '(555) 456-7890', '101 Serenity Road', 'Chicago', 'IL', 'USA', '60601', 'https://randomuser.me/api/portraits/women/4.jpg', '{"theme": "light", "language": "en", "notification_preferences": {"sms": true, "email": true}}', '{"facebook": "facebook.com/client1", "instagram": "instagram.com/client1"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406'),
(5, 5, 'Recently engaged and looking for premarital counseling to start our marriage strong.', '(555) 567-8901', '202 Tranquility Court', 'Denver', 'CO', 'USA', '80202', 'https://randomuser.me/api/portraits/men/5.jpg', '{"theme": "dark", "language": "en", "notification_preferences": {"sms": false, "email": true}}', '{"twitter": "twitter.com/client2", "instagram": "instagram.com/client2"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406'),
(6, 6, 'Marriage of 15 years, working through trust issues and seeking to rebuild our connection.', '(555) 678-9012', '303 Renewal Drive', 'Austin', 'TX', 'USA', '78701', 'https://randomuser.me/api/portraits/women/6.jpg', '{"theme": "light", "language": "en", "notification_preferences": {"sms": true, "email": false}}', '{"facebook": "facebook.com/client3"}', '2025-03-06 04:05:04.011406', '2025-03-06 04:05:04.011406');

-- Experts Table
INSERT INTO "public"."experts" ("id", "user_id", "title", "location", "experience", "specialties", "availability_status", "about", "google_meet_link") VALUES
(1, 1, 'Clinical Psychologist', 'New York, NY', 12.5, '["Anxiety", "Depression", "Cognitive Behavioral Therapy"]', 'online', 'Experienced clinical psychologist specializing in anxiety and depression treatment using evidence-based approaches.', 'https://meet.google.com/abc-defg-hij'),
(2, 2, 'Data Science Consultant', 'San Francisco, CA', 8, '["Machine Learning", "Python", "Data Analytics"]', 'offline', 'Tech industry veteran with expertise in machine learning and data analytics.', 'https://meet.google.com/klm-nopq-rst'),
(3, 3, 'Career Coach', 'Miami, FL', 10, '["Career Transition", "Leadership Development", "Interview Preparation"]', 'online', 'Certified career coach helping professionals navigate career transitions and achieve their goals.', 'https://meet.google.com/uvw-xyz1-234'),
(4, 4, 'Financial Advisor', 'Chicago, IL', 15, '["Investment Planning", "Retirement Planning", "Tax Strategy"]', 'away', 'Certified financial planner with extensive experience in wealth management and retirement planning.', 'https://meet.google.com/567-890a-bcd'),
(5, 5, 'Business Consultant', 'Austin, TX', 9.5, '["Strategic Planning", "Start-ups", "Digital Transformation"]', 'online', 'Strategic business consultant specializing in helping startups and digital transformation initiatives.', 'https://meet.google.com/efg-hijk-lmn');

-- Expert Education Table
INSERT INTO "public"."expert_education" ("id", "expert_id", "degree", "institution", "year", "created_at", "updated_at") VALUES
(1, 1, 'Ph.D. in Clinical Psychology', 'Stanford University', '2010', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(2, 1, 'M.S. in Psychology', 'Columbia University', '2006', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(3, 2, 'M.S. in Computer Science', 'MIT', '2015', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(4, 2, 'B.S. in Mathematics', 'UC Berkeley', '2012', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(5, 3, 'M.A. in Organizational Psychology', 'Harvard University', '2013', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(6, 4, 'MBA in Finance', 'University of Chicago', '2008', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(7, 5, 'MBA in Business Strategy', 'Northwestern University', '2014', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885');

-- Expert Certifications Table
INSERT INTO "public"."expert_certifications" ("id", "expert_id", "name", "issuer", "year", "expiry_date", "created_at", "updated_at") VALUES
(1, 1, 'Licensed Clinical Psychologist', 'New York State Board', '2011', '2025-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(2, 2, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2021', '2024-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(3, 3, 'Professional Certified Coach (PCC)', 'International Coach Federation', '2018', '2024-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(4, 4, 'Certified Financial Planner (CFP)', 'CFP Board', '2010', '2024-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(5, 5, 'Project Management Professional (PMP)', 'Project Management Institute', '2019', '2025-12-31 00:00:00', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885');

-- Expert Services Table
INSERT INTO "public"."expert_services" ("id", "expert_id", "name", "duration", "price", "description", "created_at", "updated_at") VALUES
(1, 1, 'Individual Therapy Session', '50 minutes', 150, 'One-on-one therapy session focused on your specific needs and goals.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(2, 1, 'Couples Counseling', '80 minutes', 200, 'Therapy session for couples working through relationship challenges.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(3, 2, 'Data Strategy Consultation', '60 minutes', 200, 'Strategic planning for data infrastructure and analytics implementation.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(4, 3, 'Career Strategy Session', '45 minutes', 125, 'Personalized career guidance and action planning.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(5, 4, 'Financial Planning Session', '60 minutes', 175, 'Comprehensive financial planning and investment strategy.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885'),
(6, 5, 'Business Strategy Consultation', '90 minutes', 250, 'In-depth business analysis and strategic planning session.', '2025-03-05 15:42:54.165885', '2025-03-05 15:42:54.165885');

-- Expert Availability Table
INSERT INTO "public"."expert_availability" ("id", "expert_id", "day_of_week", "start_time", "end_time", "is_available", "created_at", "updated_at") VALUES
(1, 1, 'monday', '09:00:00', '17:00:00', 't', '2025-03-06 07:49:42.908848', '2025-03-06 07:49:42.908848'),
(2, 1, 'tuesday', '09:00:00', '17:00:00', 't', '2025-03-06 07:49:42.908848', '2025-03-06 07:49:42.908848'),
(3, 1, 'wednesday', '09:00:00', '17:00:00', 't', '2025-03-06 07:49:42.908848', '2025-03-06 07:49:42.908848'),
(4, 1, 'thursday', '09:00:00', '17:00:00', 't', '2025-03-06 07:49:42.908848', '2025-03-06 07:49:42.908848'),
(5, 1, 'friday', '09:00:00', '17:00:00', 't', '2025-03-06 07:49:42.908848', '2025-03-06 07:49:42.908848'),
(6, 2, 'monday', '17:00:00', '21:00:00', 't', '2025-03-06 07:50:06.794044', '2025-03-06 07:50:06.794044'),
(7, 2, 'wednesday', '17:00:00', '21:00:00', 't', '2025-03-06 07:50:06.794044', '2025-03-06 07:50:06.794044'),
(8, 2, 'friday', '17:00:00', '21:00:00', 't', '2025-03-06 07:50:06.794044', '2025-03-06 07:50:06.794044'),
(9, 2, 'saturday', '10:00:00', '18:00:00', 't', '2025-03-06 07:50:06.794044', '2025-03-06 07:50:06.794044'),
(10, 2, 'sunday', '10:00:00', '18:00:00', 't', '2025-03-06 07:50:06.794044', '2025-03-06 07:50:06.794044'),
(11, 3, 'monday', '07:00:00', '12:00:00', 't', '2025-03-06 07:50:22.957984', '2025-03-06 07:50:22.957984'),
(12, 3, 'tuesday', '07:00:00', '12:00:00', 't', '2025-03-06 07:50:22.957984', '2025-03-06 07:50:22.957984'),
(13, 3, 'wednesday', '07:00:00', '12:00:00', 't', '2025-03-06 07:50:22.957984', '2025-03-06 07:50:22.957984'),
(14, 3, 'thursday', '07:00:00', '12:00:00', 't', '2025-03-06 07:50:22.957984', '2025-03-06 07:50:22.957984'),
(15, 3, 'friday', '07:00:00', '12:00:00', 't', '2025-03-06 07:50:22.957984', '2025-03-06 07:50:22.957984'),
(16, 4, 'tuesday', '09:00:00', '13:00:00', 't', '2025-03-06 07:50:34.43651', '2025-03-06 07:50:34.43651'),
(17, 4, 'tuesday', '15:00:00', '19:00:00', 't', '2025-03-06 07:50:34.43651', '2025-03-06 07:50:34.43651'),
(18, 4, 'thursday', '09:00:00', '13:00:00', 't', '2025-03-06 07:50:34.43651', '2025-03-06 07:50:34.43651'),
(19, 4, 'thursday', '15:00:00', '19:00:00', 't', '2025-03-06 07:50:34.43651', '2025-03-06 07:50:34.43651'),
(20, 4, 'saturday', '10:00:00', '16:00:00', 't', '2025-03-06 07:50:34.43651', '2025-03-06 07:50:34.43651'),
(21, 5, 'monday', '08:00:00', '14:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838'),
(22, 5, 'tuesday', '10:00:00', '16:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838'),
(23, 5, 'wednesday', '12:00:00', '18:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838'),
(24, 5, 'thursday', '14:00:00', '20:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838'),
(25, 5, 'friday', '08:00:00', '14:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838'),
(26, 5, 'saturday', '09:00:00', '15:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838'),
(27, 5, 'sunday', '11:00:00', '17:00:00', 't', '2025-03-06 07:50:47.290838', '2025-03-06 07:50:47.290838');

-- Appointments Table
INSERT INTO "public"."appointments" ("id", "expert_id", "user_id", "scheduled_time", "status", "service_id", "end_time", "notes", "created_at", "updated_at") VALUES
(1, 1, 6, '2025-11-03 02:00:00', 'canceled', 1, '2025-11-03 02:50:00', 'Hello', '2025-03-11 06:51:26.938651', '2025-03-18 19:20:55.509'),
(4, 1, 7, '2025-03-13 06:45:00', 'pending', 1, '2025-03-13 07:35:00', '', '2025-03-13 06:32:36.709079', '2025-03-13 06:32:36.709079'),
(5, 1, 7, '2025-03-18 02:00:00', 'pending', 1, '2025-03-18 02:50:00', '', '2025-03-13 06:39:12.655314', '2025-03-13 06:39:12.655314'),
(6, 1, 7, '2025-03-20 02:00:00', 'pending', 2, '2025-03-20 03:20:00', '', '2025-03-13 06:41:01.429629', '2025-03-13 06:41:01.429629'),
(7, 1, 7, '2025-03-18 02:50:00', 'pending', 1, '2025-03-18 03:40:00', '', '2025-03-13 06:47:50.182675', '2025-03-13 06:47:50.182675'),
(8, 2, 7, '2025-03-24 12:00:00', 'pending', 3, '2025-03-24 13:00:00', '', '2025-03-13 06:54:49.12175', '2025-03-13 06:54:49.12175'),
(9, 1, 7, '2025-03-13 07:35:00', 'pending', 1, '2025-03-13 08:25:00', '', '2025-03-13 06:55:45.443363', '2025-03-13 06:55:45.443363'),
(10, 2, 7, '2025-03-26 12:00:00', 'pending', 3, '2025-03-26 13:00:00', '', '2025-03-13 07:08:45.776377', '2025-03-13 07:08:45.776377'),
(11, 1, 7, '2025-03-18 03:40:00', 'pending', 2, '2025-03-18 05:00:00', '', '2025-03-17 18:01:46.136869', '2025-03-17 18:01:46.136869'),
(12, 2, 6, '2025-03-19 10:00:00', 'canceled', 3, '2025-03-19 11:00:00', '', '2025-03-18 17:36:02.143957', '2025-03-18 19:32:27.201'),
(13, 1, 6, '2025-03-20 06:20:00', 'pending', 1, '2025-03-20 07:10:00', '', '2025-03-18 19:32:45.901277', '2025-03-18 19:32:45.901277'),
(14, 2, 6, '2025-03-26 10:00:00', 'pending', 3, '2025-03-26 11:00:00', 'Hello', '2025-03-20 03:33:18.12526', '2025-03-20 03:33:18.12526');

-- Payments Table
INSERT INTO "public"."payments" ("id", "user_id", "amount", "created_at", "updated_at", "expert_id", "status", "payment_method", "appointment_id", "payos_order_id") VALUES
(1, 6, 3750000, '2025-03-13 03:25:21.967748', '2025-03-13 03:25:21.967748', 1, 'pending', 'payos', 1, '321585'),
(2, 6, 150000, '2025-03-13 03:31:45.421872', '2025-03-13 03:31:45.421872', 1, 'pending', 'payos', 1, NULL),
(3, 6, 150000, '2025-03-13 03:32:42.464902', '2025-03-13 03:32:42.464902', 1, 'pending', 'payos', 1, NULL),
(4, 6, 150000, '2025-03-13 05:41:22.383151', '2025-03-13 05:41:22.383151', 1, 'pending', 'payos', 1, '769310835'),
(5, 6, 200000, '2025-03-13 06:44:05.595419', '2025-03-13 06:44:05.595419', 1, 'pending', 'payos', 6, '640703209'),
(6, 7, 150000, '2025-03-13 06:54:03.013396', '2025-03-13 06:54:03.013396', 1, 'pending', 'payos', 7, '954406656'),
(7, 7, 200000, '2025-03-13 06:54:52.453622', '2025-03-13 06:54:52.453622', 2, 'pending', 'payos', 8, '633941137'),
(8, 7, 150000, '2025-03-13 06:55:48.414501', '2025-03-13 06:55:48.414501', 1, 'pending', 'payos', 9, '399176117'),
(9, 7, 200000, '2025-03-13 07:08:48.032967', '2025-03-13 07:08:48.032967', 2, 'pending', 'payos', 10, '438796637'),
(10, 6, 200000, '2025-03-18 17:36:04.139709', '2025-03-18 17:36:04.139709', 2, 'pending', 'payos', 12, '765016802'),
(11, 6, 200000, '2025-03-20 03:33:21.602073', '2025-03-20 03:33:21.602073', 2, 'pending', 'payos', 14, '741734938');
