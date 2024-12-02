CREATE TABLE public.medications (
    id serial4 NOT NULL,
    "name" varchar(255) NOT NULL,
    dosage int4 NOT NULL,
    start_date date NOT NULL,
    end_date date NULL,
    observations text NULL,
    user_id int4 NOT NULL,
    CONSTRAINT medications_pkey PRIMARY KEY (id),
    CONSTRAINT medications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
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
    user_id int4 NOT NULL,
    CONSTRAINT responsibles_cpf_key UNIQUE (cpf),
    CONSTRAINT responsibles_email_key UNIQUE (email),
    CONSTRAINT responsibles_pkey PRIMARY KEY (id),
    CONSTRAINT responsibles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);

CREATE TABLE public.administration_schedules (
    id serial4 NOT NULL,
    medication_id int4 NULL,
    "time" time NOT NULL,
    days_of_week _text NOT NULL,
    CONSTRAINT administration_schedules_pkey PRIMARY KEY (id),
    CONSTRAINT administration_schedules_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications (id)
);

CREATE TABLE public.alerts (
    id serial4 NOT NULL,
    "name" varchar(255) NOT NULL,
    play_count int4 NOT NULL,
    is_active bool DEFAULT true NULL,
    medication_id int4 NULL,
    user_id int4 NOT NULL,
    CONSTRAINT alerts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_medication FOREIGN KEY (medication_id) REFERENCES public.medications (id),
    CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);

CREATE TABLE public.medication_logs (
    id serial4 NOT NULL,
    medication_id int4 NULL,
    taken bool NULL,
    date_taken timestamp DEFAULT now() NULL,
    user_id int4 NOT NULL,
    CONSTRAINT medication_logs_pkey PRIMARY KEY (id),
    CONSTRAINT medication_logs_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications (id),
    CONSTRAINT medication_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id)
);
