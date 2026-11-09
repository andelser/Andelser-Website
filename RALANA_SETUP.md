# Ralana Hosting & App Store Launch Guide

This repository is configured with Firebase multi-site hosting to deploy both:
1. The **Andelser** main website (`andelser.com`) from root.
2. The **Ralana** website & legal policies (`ralana.andelser.com`) from the `ralana/` directory.

---

## 1. Quick One-Time Firebase Setup

Run these commands in your terminal from this folder (`c:\Users\smzab\Documents\Andelser\Andelser Website`):

### Step A: Authenticate (if not already logged in)
```powershell
firebase login
```

### Step B: Create the new hosting site for Ralana
Site IDs must be globally unique across Firebase (alphanumeric and dashes, max 30 characters). A recommended ID is `andelser-ralana`:
```powershell
firebase hosting:sites:create andelser-ralana --project andelser
```
*(If `andelser-ralana` is taken, try `ralana-app` or `ralana-engine`).*

### Step C: Map the `ralana` deploy target
Link the newly created site to the `ralana` target configured in `firebase.json`:
```powershell
firebase target:apply hosting ralana andelser-ralana --project andelser
```

---

## 2. Deploy Ralana

Deploy **only** the Ralana site without re-deploying or affecting the main Andelser website:
```powershell
firebase deploy --only hosting:ralana --project andelser
```

Once deployed, you can verify your site immediately at:
`https://andelser-ralana.web.app` (or your chosen site ID).

---

## 3. Connect `ralana.andelser.com` (Custom Domain)

1. Open the [Firebase Console](https://console.firebase.google.com/) → Select project **andelser**.
2. Navigate to **Hosting** in the left sidebar.
3. Select your new Ralana site (`andelser-ralana`).
4. Click **Add custom domain**.
5. Enter: `ralana.andelser.com`.
6. Firebase will provide a DNS record (usually a `CNAME` pointing to `andelser-ralana.web.app` or an `A` record).
7. In your DNS provider for `andelser.com` (e.g., Cloudflare, Namecheap, Google Domains):
   - Add a `CNAME` record:
     - **Name / Host:** `ralana`
     - **Target / Value:** `andelser-ralana.web.app` (or the value Firebase displays)
8. Firebase will automatically provision an SSL certificate (usually takes 5 to 30 minutes).

Once verified, your live URLs will be:
- Home: `https://ralana.andelser.com`
- Privacy Policy: `https://ralana.andelser.com/privacy`
- Terms of Use: `https://ralana.andelser.com/terms`
- Support: `https://ralana.andelser.com/support`

---

## 4. App Store Connect (TestFlight) & Google Play Console Setup

### App Store Connect:

- **Privacy Policy URL:** `https://ralana.andelser.com/privacy`
- **Support URL:** `https://ralana.andelser.com/support`
- **Marketing URL:** `https://ralana.andelser.com`
- **App Privacy:** Use the actual app and provider inventory, including retained participant identifiers and operational records. No accounts does not mean no data collected. Do not automatically choose “Data Not Collected.”
- **Age rating:** Answer against the included stories, interactions and capabilities. The current beta eligibility is US participants aged 13+, with parent/guardian permission and supervision for ages 13–17; content ratings and beta eligibility are separate.
- **External test:** Use controlled tester invitations, provide review contacts and multi-device instructions, and keep the relay available. The app shows the eligibility notice without an age questionnaire. Native age APIs are deferred; do not describe the app as automatically verifying age.

### Google Play Console (Closed Testing):

- **Privacy Policy URL:** `https://ralana.andelser.com/privacy`
- **App Access:** No Ralana account or credentials are needed. Explain the multi-phone setup, relay access and beta restrictions in review instructions.
- **Ads:** No ads in the current app.
- **Target audience:** Declare the intended 13+ audience honestly. An age setting alone does not establish the app's legal audience or automatically exempt a child-directed design from Families rules.
- **Data safety:** Complete the form for the closed track from the actual inventory. Include pseudonymous identifiers and app activity as applicable. Assess ephemeral handling and service-provider sharing exceptions separately; do not automatically answer “No data collected.”
- **Invitations and countries:** Use the closed track's controlled tester list and US distribution settings. Public recruitment must make the 13+ and teen-supervision requirements clear.
- **Native age assurance:** Google Play Age Signals and Apple's Declared Age Range are not integrated in this beta. Review applicable regional requirements before expanding distribution.

The November 3, 2026 app policy follow-up in the Unblur repository records the implemented notice, offline policies, tests and remaining release/operations checks. Store-console declarations must be completed independently; publishing the website does not update either console.

---

## 5. Ongoing Maintenance Commands

* Deploy Ralana updates only:
  ```powershell
  firebase deploy --only hosting:ralana --project andelser
  ```
* Deploy main Andelser website only:
  ```powershell
  firebase deploy --only hosting:andelser --project andelser
  ```
* Deploy both sites together:
  ```powershell
  firebase deploy --project andelser
  ```
