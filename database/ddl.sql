--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 9.5.10

-- Started on 2018-02-02 23:53:28 -05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12361)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2128 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_with_oids = false;

--
-- TOC entry 181 (class 1259 OID 42497)
-- Name: beatmap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE beatmap (
    beatmapset_id bigint NOT NULL,
    artist text,
    title text,
    creator text,
    bpm text,
    favourite_count character varying
);


--
-- TOC entry 182 (class 1259 OID 42503)
-- Name: mod_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE mod_request (
    id bigint NOT NULL,
    "time" timestamp without time zone NOT NULL,
    nick character varying NOT NULL,
    set text NOT NULL,
    beatmap_id bigint NOT NULL
);


--
-- TOC entry 183 (class 1259 OID 42509)
-- Name: mod_request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE mod_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2129 (class 0 OID 0)
-- Dependencies: 183
-- Name: mod_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE mod_request_id_seq OWNED BY mod_request.id;


--
-- TOC entry 184 (class 1259 OID 42511)
-- Name: survey; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE survey (
    id bigint NOT NULL,
    "time" timestamp without time zone NOT NULL,
    text character varying NOT NULL,
    beatmap_id bigint NOT NULL
);


--
-- TOC entry 185 (class 1259 OID 42517)
-- Name: survey_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE survey_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2130 (class 0 OID 0)
-- Dependencies: 185
-- Name: survey_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE survey_id_seq OWNED BY survey.id;


--
-- TOC entry 1998 (class 2604 OID 42519)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY mod_request ALTER COLUMN id SET DEFAULT nextval('mod_request_id_seq'::regclass);


--
-- TOC entry 1999 (class 2604 OID 42520)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY survey ALTER COLUMN id SET DEFAULT nextval('survey_id_seq'::regclass);


--
-- TOC entry 2001 (class 2606 OID 42523)
-- Name: beatmap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY beatmap
    ADD CONSTRAINT beatmap_pkey PRIMARY KEY (beatmapset_id);


--
-- TOC entry 2003 (class 2606 OID 42525)
-- Name: mod_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY mod_request
    ADD CONSTRAINT mod_request_pkey PRIMARY KEY (id);


--
-- TOC entry 2005 (class 2606 OID 42527)
-- Name: survey_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY survey
    ADD CONSTRAINT survey_pkey PRIMARY KEY (id);


--
-- TOC entry 2006 (class 2606 OID 42528)
-- Name: bm_survey_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY mod_request
    ADD CONSTRAINT bm_survey_fk FOREIGN KEY (beatmap_id) REFERENCES beatmap(beatmapset_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2007 (class 2606 OID 42533)
-- Name: bm_survey_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY survey
    ADD CONSTRAINT bm_survey_fk FOREIGN KEY (beatmap_id) REFERENCES beatmap(beatmapset_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2018-02-02 23:53:29 -05

--
-- PostgreSQL database dump complete
--

