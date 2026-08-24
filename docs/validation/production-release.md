# Production Release Evidence

Status: PENDING

No live production value has been recorded in this initial evidence template. Replace each `PENDING` observation only with fresh, same-run evidence. Never paste deployment tokens or private secret values into this document; record a TXT value only after it is publicly observable in DNS.

## Release identity

| Field                          | Evidence                                              |
| ------------------------------ | ----------------------------------------------------- |
| UTC timestamp                  | PENDING                                               |
| Local validation UTC timestamp | PENDING                                               |
| Release SHA                    | PENDING                                               |
| Source branch                  | Intended: `main`; observed: PENDING                   |
| Workflow file                  | `.github/workflows/deploy-swa-itl-aserdargun-com.yml` |
| Workflow URL                   | PENDING                                               |
| Workflow conclusion            | PENDING                                               |
| Deploy step conclusion         | PENDING                                               |

The successful workflow run must be for the recorded Release SHA. A queued, cancelled, superseded, or build-only run is not release evidence.

## Azure Static Web Apps

| Field                                         | Evidence                                               |
| --------------------------------------------- | ------------------------------------------------------ |
| Subscription                                  | Intended: `aserdargun subscription`; observed: PENDING |
| Tenant/account                                | PENDING                                                |
| Resource group                                | Intended: `rg-itl-aserdargun-com`; observed: PENDING   |
| Static Web App                                | Intended: `swa-itl-aserdargun-com`; observed: PENDING  |
| Location                                      | Intended: `westeurope`; observed: PENDING              |
| SKU                                           | Intended: `Free`; observed: PENDING                    |
| Generated hostname                            | PENDING                                                |
| Provisioning state                            | PENDING                                                |
| Production environment status                 | PENDING                                                |
| Production branch and exposed commit identity | PENDING                                                |
| Environment update UTC timestamp              | PENDING                                                |
| Custom domains                                | PENDING                                                |

The Generated hostname must be read from the exact Static Web App. Its production environment update must be no earlier than the successful deploy step and must correlate to the Release SHA before domain work begins.

## DNS authority and custom domain

| Field                                   | Evidence                                                   |
| --------------------------------------- | ---------------------------------------------------------- |
| DNS query UTC timestamp                 | PENDING                                                    |
| Authoritative nameservers               | PENDING                                                    |
| Ownership owner                         | Intended: `_dnsauth.itl.aserdargun.com`; observed: PENDING |
| Ownership TXT answer on every authority | PENDING                                                    |
| Custom-domain owner                     | Intended: `itl.aserdargun.com`; observed: PENDING          |
| CNAME target on every authority         | PENDING                                                    |
| Public recursive TXT answers            | PENDING                                                    |
| Public recursive CNAME answers          | PENDING                                                    |
| Azure custom-domain status              | PENDING                                                    |

Record fresh TXT answers only after they are publicly observable; never source them from private secret output. DNS completion requires matching answers from every authoritative nameserver, converged public recursive answers, and Azure `Validated` status.

## TLS and HTTP

| Field                                                   | Evidence |
| ------------------------------------------------------- | -------- |
| Verification UTC timestamp                              | PENDING  |
| TLS subject                                             | PENDING  |
| TLS SAN                                                 | PENDING  |
| TLS verification result                                 | PENDING  |
| Generated-hostname HTTP status and content marker       | PENDING  |
| Custom-domain homepage HTTP status and content marker   | PENDING  |
| Custom-domain deep-route HTTP status and content marker | PENDING  |
| Security headers                                        | PENDING  |
| Representative asset status and content type            | PENDING  |

Expected content markers must uniquely identify Industrial Twin Lab. Record the observed CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` values with the HTTP evidence.

## Browser and production tests

| Field                                       | Evidence |
| ------------------------------------------- | -------- |
| Browser verification UTC timestamp          | PENDING  |
| Browser routes exercised                    | PENDING  |
| Homepage identity and primary interaction   | PENDING  |
| Mobile navigation                           | PENDING  |
| Architecture publication                    | PENDING  |
| Experiment demonstrator state change        | PENDING  |
| Relevant browser console errors or warnings | PENDING  |
| Desktop and mobile overflow                 | PENDING  |
| Production-targeted tests                   | PENDING  |

## Local shutdown

| Field                               | Evidence             |
| ----------------------------------- | -------------------- |
| Local Stop command                  | `npm run stop:codex` |
| Local Stop UTC timestamp and result | PENDING              |
| Port 4173 listener                  | PENDING              |

Release completion requires a successful project-scoped Local Stop and an independent check that no project-owned listener remains on port 4173.
