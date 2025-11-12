import http from "k6/http";
import { check, sleep, group } from "k6";

const BASE_URL = (
  __ENV.BASE_URL || "https://chatku-908670392031.asia-southeast2.run.app/"
).replace(/\/$/, "");
const AUTH_URL = `${BASE_URL}/api/ably-auth`;

export const options = {
  discardResponseBodies: true,
  systemTags: [
    "status",
    "method",
    "name",
    "group",
    "check",
    "scenario",
    "expected_response",
  ],

  scenarios: {
    warmup: {
      exec: "home",
      executor: "constant-arrival-rate",
      rate: 1,
      timeUnit: "1s",
      duration: "20s",
      preAllocatedVUs: 5,
      maxVUs: 10,
    },

    ramp_auth: {
      exec: "ablyAuth",
      executor: "ramping-arrival-rate",
      timeUnit: "1s",
      startRate: 1,
      preAllocatedVUs: 10,
      maxVUs: 40,
      stages: [
        { duration: "45s", target: 5 },
        { duration: "60s", target: 10 },
        { duration: "30s", target: 0 },
      ],
      gracefulStop: "15s",
    },

    ramp_home: {
      exec: "home",
      executor: "ramping-arrival-rate",
      timeUnit: "1s",
      startRate: 1,
      preAllocatedVUs: 8,
      maxVUs: 30,
      stages: [
        { duration: "45s", target: 3 },
        { duration: "60s", target: 5 },
        { duration: "30s", target: 0 },
      ],
      gracefulStop: "15s",
    },
  },

  thresholds: {
    "http_req_duration{name:ably_auth}": ["p(95)<100", "p(99)<200"],
    "http_req_failed{name:ably_auth}": ["rate<0.01"],
    "http_req_duration{name:home}": ["p(95)<300", "p(99)<600"],
    "http_req_failed{name:home}": ["rate<0.01"],
  },
};

export function home() {
  group("home", () => {
    const res = http.get(http.url`${BASE_URL}/`, {
      tags: { name: "home", endpoint: "home" },
    });
    check(res, {
      "home: status 200": (r) => r.status === 200,
      "home: body not empty": (r) => (r.body || "").length > 0,
    });
    sleep(0.5);
  });
}

export function ablyAuth() {
  group("ably_auth", () => {
    const cid = `vu${__VU}-it${__ITER}`;
    const res = http.get(http.url`${AUTH_URL}?clientId=${cid}`, {
      tags: { name: "ably_auth", endpoint: "ably_auth" },
    });
    check(res, {
      "auth: status 200": (r) => r.status === 200,
      "auth: has mac": (r) => {
        try {
          const j = r.json();
          return !!j && typeof j.mac === "string" && j.mac.length > 0;
        } catch {
          return false;
        }
      },
    });
    sleep(0.2);
  });
}

export function handleSummary(data) {
  return { "k6-summary.json": JSON.stringify(data, null, 2) };
}
