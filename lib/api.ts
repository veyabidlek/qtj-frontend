"use client";

import createClient from "openapi-fetch";
import type { paths } from "@/types/api";

const client = createClient<paths>({ baseUrl: "" });

export default client;
