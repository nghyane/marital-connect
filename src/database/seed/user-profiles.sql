-- Insert user profiles for users with IDs 1-6
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
),
(6, 'Marriage of 15 years, working through trust issues and seeking to rebuild our connection.', 
 '(555) 678-9012', '303 Renewal Drive', 'Austin', 'TX', 'USA', '78701', 
 'https://randomuser.me/api/portraits/women/6.jpg',
 '{"notification_preferences": {"email": false, "sms": true}, "theme": "light", "language": "en"}',
 '{"facebook": "facebook.com/client3"}'
); 