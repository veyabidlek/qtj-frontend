"use client";

import createClient from "openapi-fetch";
import type { paths } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const client = createClient<paths>({ baseUrl: API_URL });

export default client;
