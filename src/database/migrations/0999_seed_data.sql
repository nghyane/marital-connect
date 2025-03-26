--> Insert users with role_id = 3 (expert role)
INSERT INTO users (name, email, password, role_id)
VALUES
    ('Dr. Sarah Johnson', 'sarah.johnson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3),
    ('Prof. Michael Chen', 'michael.chen@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3),
    ('Dr. Emily Rodriguez', 'emily.rodriguez@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3),
    ('Dr. James Wilson', 'james.wilson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3),
    ('Dr. Lisa Thompson', 'lisa.thompson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NcbqCdnDm', 3);

--> Create their expert profiles
INSERT INTO experts (user_id, title, location, experience, specialties, availability_status, about)
VALUES
    (1, 'Clinical Psychologist', 'New York, NY', 12.5, '["Anxiety", "Depression", "Cognitive Behavioral Therapy"]', 'online', 'Experienced clinical psychologist specializing in anxiety and depression treatment using evidence-based approaches.'),
    (2, 'Data Science Consultant', 'San Francisco, CA', 8.0, '["Machine Learning", "Python", "Data Analytics"]', 'offline', 'Tech industry veteran with expertise in machine learning and data analytics.'),
    (3, 'Career Coach', 'Miami, FL', 10.0, '["Career Transition", "Leadership Development", "Interview Preparation"]', 'online', 'Certified career coach helping professionals navigate career transitions and achieve their goals.'),
    (4, 'Financial Advisor', 'Chicago, IL', 15.0, '["Investment Planning", "Retirement Planning", "Tax Strategy"]', 'away', 'Certified financial planner with extensive experience in wealth management and retirement planning.'),
    (5, 'Business Consultant', 'Austin, TX', 9.5, '["Strategic Planning", "Start-ups", "Digital Transformation"]', 'online', 'Strategic business consultant specializing in helping startups and digital transformation initiatives.');

--> Add their education
INSERT INTO expert_education (expert_id, degree, institution, year)
VALUES
    (1, 'Ph.D. in Clinical Psychology', 'Stanford University', '2010'),
    (1, 'M.S. in Psychology', 'Columbia University', '2006'),
    (2, 'M.S. in Computer Science', 'MIT', '2015'),
    (2, 'B.S. in Mathematics', 'UC Berkeley', '2012'),
    (3, 'M.A. in Organizational Psychology', 'Harvard University', '2013'),
    (4, 'MBA in Finance', 'University of Chicago', '2008'),
    (5, 'MBA in Business Strategy', 'Northwestern University', '2014');

--> Add their certifications
INSERT INTO expert_certifications (expert_id, name, issuer, year, expiry_date)
VALUES
    (1, 'Licensed Clinical Psychologist', 'New York State Board', '2011', '2025-12-31'),
    (2, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2021', '2024-12-31'),
    (3, 'Professional Certified Coach (PCC)', 'International Coach Federation', '2018', '2024-12-31'),
    (4, 'Certified Financial Planner (CFP)', 'CFP Board', '2010', '2024-12-31'),
    (5, 'Project Management Professional (PMP)', 'Project Management Institute', '2019', '2025-12-31');

--> Add their services
INSERT INTO expert_services (expert_id, name, duration, price, description)
VALUES
    (1, 'Individual Therapy Session', '50 minutes', 150, 'One-on-one therapy session focused on your specific needs and goals.'),
    (1, 'Couples Counseling', '80 minutes', 200, 'Therapy session for couples working through relationship challenges.'),
    (2, 'Data Strategy Consultation', '60 minutes', 200, 'Strategic planning for data infrastructure and analytics implementation.'),
    (3, 'Career Strategy Session', '45 minutes', 125, 'Personalized career guidance and action planning.'),
    (4, 'Financial Planning Session', '60 minutes', 175, 'Comprehensive financial planning and investment strategy.'),
    (5, 'Business Strategy Consultation', '90 minutes', 250, 'In-depth business analysis and strategic planning session.');

--> Insert user profiles for users with IDs 1-6
INSERT INTO user_profiles (
    user_id, bio, phone, address, city, state, country, postal_code, 
    profile_image, preferences, social_links
) VALUES
(1, 'Licensed marriage counselor with 10+ years of experience helping couples build stronger relationships.', 
 '(555) 123-4567', '123 Harmony Lane', 'Seattle', 'WA', 'USA', '98101', 
 'https://randomuser.me/api/portraits/women/1.jpg',
 '{"notification_preferences": {"email": true, "sms": true}, "theme": "light", "language": "en"}',
 '{"linkedin": "linkedin.com/in/counselor1", "twitter": "twitter.com/counselor1"}'
),
(2, 'Relationship expert specializing in communication issues and conflict resolution techniques.', 
 '(555) 234-5678', '456 Connection Avenue', 'Portland', 'OR', 'USA', '97201', 
 'https://randomuser.me/api/portraits/men/2.jpg',
 '{"notification_preferences": {"email": true, "sms": false}, "theme": "dark", "language": "en"}',
 '{"linkedin": "linkedin.com/in/counselor2", "instagram": "instagram.com/counselor2"}'
),
(3, 'Family therapist with expertise in blended families and parenting challenges.', 
 '(555) 345-6789', '789 Unity Street', 'San Francisco', 'CA', 'USA', '94105', 
 'https://randomuser.me/api/portraits/women/3.jpg',
 '{"notification_preferences": {"email": true, "sms": true}, "theme": "light", "language": "es"}',
 '{"linkedin": "linkedin.com/in/counselor3", "facebook": "facebook.com/counselor3"}'
),
(4, 'Seeking guidance on improving communication with my partner of 5 years.', 
 '(555) 456-7890', '101 Serenity Road', 'Chicago', 'IL', 'USA', '60601', 
 'https://randomuser.me/api/portraits/women/4.jpg',
 '{"notification_preferences": {"email": true, "sms": true}, "theme": "light", "language": "en"}',
 '{"instagram": "instagram.com/client1", "facebook": "facebook.com/client1"}'
),
(5, 'Recently engaged and looking for premarital counseling to start our marriage strong.', 
 '(555) 567-8901', '202 Tranquility Court', 'Denver', 'CO', 'USA', '80202', 
 'https://randomuser.me/api/portraits/men/5.jpg',
 '{"notification_preferences": {"email": true, "sms": false}, "theme": "dark", "language": "en"}',
 '{"twitter": "twitter.com/client2", "instagram": "instagram.com/client2"}'
);