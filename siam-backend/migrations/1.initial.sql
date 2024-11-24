CREATE TABLE public.medications (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	dosage int4 NOT NULL,
	start_date date NOT NULL,
	end_date date NULL,
	observations text NULL,
	CONSTRAINT medications_pkey PRIMARY KEY (id)
);

CREATE TABLE public.responsibles (
	id serial4 NOT NULL,
	full_name varchar(255) NOT NULL,
	cpf varchar(14) NOT NULL,
	rg varchar(20) NULL,
	birthdate date NOT NULL,
	phone_number varchar(20) NOT NULL,
	email varchar(255) NOT NULL,
	address varchar(255) NULL,
	city varchar(100) NULL,
	zip_code varchar(10) NULL,
	observations text NULL,
	CONSTRAINT responsibles_cpf_key UNIQUE (cpf),
	CONSTRAINT responsibles_email_key UNIQUE (email),
	CONSTRAINT responsibles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
	id serial4 NOT NULL,
	full_name varchar(100) NOT NULL,
	nickname varchar(50) NULL,
	email varchar(100) NOT NULL,
	phone_number varchar(20) NOT NULL,
	cpf varchar(14) NOT NULL,
	birthdate date NOT NULL,
	address varchar(255) NULL,
	city varchar(100) NULL,
	zip_code varchar(20) NULL,
	observations text NULL,
	username varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT users_cpf_key UNIQUE (cpf),
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username)
);

CREATE TABLE public.administration_schedules (
	id serial4 NOT NULL,
	medication_id int4 NULL,
	"time" time NOT NULL,
	days_of_week _text NOT NULL,
	CONSTRAINT administration_schedules_pkey PRIMARY KEY (id),
	CONSTRAINT administration_schedules_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id)
);

CREATE TABLE public.alerts (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	play_count int4 NOT NULL,
	is_active bool DEFAULT true NULL,
	medication_id int4 NULL,
	CONSTRAINT alerts_pkey PRIMARY KEY (id),
	CONSTRAINT fk_medication FOREIGN KEY (medication_id) REFERENCES public.medications(id)
);

CREATE TABLE public.medication_logs (
	id serial4 NOT NULL,
	medication_id int4 NULL,
	taken bool NULL,
	date_taken timestamp DEFAULT now() NULL,
	CONSTRAINT medication_logs_pkey PRIMARY KEY (id),
	CONSTRAINT medication_logs_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id)
);
