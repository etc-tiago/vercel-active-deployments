# Vercel Active Deployments "VAD"

## Motivation

During the development of https://clinica.work, we created a large monorepo, which already contains more than 500 thousand lines of code (without node_modules).

Since we moved our webapps from AWS S3 to Vercel, it became a fundamental part of our work. We have added many webapps in nextjs that cover all functionalities for medical clinics in Brazil.

Some features:
- WebApp with multiple subdomains: {clinic-slug}.clinica.work
- Marketing website (https://clinica.work), accessed by patients
- Marketing website for professionals (https://pro.clinica.work), accessed by healthcare professionals
- Webhook app with real-time control panel
- 3 administrative panels that use 4 databases
- Other webapps for smaller things

In short, a lot of nextjs, turbo and deployments.

## Our problem

- When there is a bug fix in one of the webapps mentioned above, vercel intelligently creates 1 deployment of the last commit for each item in the monorepo.
- When the package updater is running, we didn't know which deployment was delaying our tests, especially when we urgently needed to fix something.
- The big problem is that, often, active deployment is not what needs to be corrected. This makes us lose precious minutes.

## What do we "fix"?

With this dashboard, you can change the .env to your dashboard token and team ID and check which deployments are:
- Building, to be able to cancel them if necessary
- Check which deployment is happening now, without having to "hunt" between projects.
- Check in one place which deployment had an error during execution.

We hope @vercel looks with love and care at this repo and implements it in the future in their dashboard, as we know they can do a much better job than this small hotfix to our workflow.