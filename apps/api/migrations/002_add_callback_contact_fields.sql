ALTER TABLE contact_submissions
ADD COLUMN country TEXT NOT NULL DEFAULT '';

ALTER TABLE contact_submissions
ADD COLUMN country_code TEXT NOT NULL DEFAULT '';

ALTER TABLE contact_submissions
ADD COLUMN phone_number TEXT NOT NULL DEFAULT '';
