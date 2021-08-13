## Assumptions for this scenario
- Packaged deployable artifact (minified, uglified, webpacked, etc etc)
    - not currently implemented
    - Deployable anywhere (OS level, webapp, mobile)

# Deploy, test, maintain
- Versioning / Branching
    - Code repo should have branches/tagged release structure
        - main/master/production branch, aligned with deployed production code
            - Tagged releases with artifacts
                - May also be stored elsewhere, such as artifactory
                - Should make it easy to go back and either rebuild a specific version/release or have the artifact readily available
                    - required for rollback/testing specific issues in specific releases
            - Merges/pushes into main should be gated
                - should pass build check
                - If necessary could have any final sanity check tests ancillary to suite kicked off earlier in develop
                    - could have further checks such as approval from QA, product owners, etc
                        - full automatic ci/cd may not have any manual gating (between develop and main), as long as automation gating is fully fleshed out
        - dev/integration branch
            - deployable to a staging or dev environment with parity with production, so releases can be vetted in a prod-like environment as close to end user experience as possible
            - should pass full integration/regression/e2e tests kicked off after being merged into development
                - could have further manual checks such as approval from QA, product owners, etc
        - feature branches
            - Should pass unit tests before PR
                - Gating at commit or push may be impractical
            - On PR creation, should kick off automated feature/regression tests
                - Should be written alongside feature creation
- Test suites
    - Unit tests
        - As above, should pass unit test before PR
    - Integration/e2e
        - As test suites grow, may need to be divided up
            - While testing is important, making developers wait for 2 hours before they can merge might not be ideal
            - Tests could be divided up into
                - Smoke
                    - quick, fast, super high level (relative definitions)
                        - This might take just a few minutes, and might be more appropriate as a gate in certain situations than a regression suite, if a regression suite takes a long time
                - regression/functional/integration/e2e
                    - if these take a long time, may be more appropriate as the gate/autokickoff for the integration/develop branch, and not at the PR stage
                    - Could also be divided up
                        - subset of it run at integration
                            - may be issues with server availability, gating of further merges into development, so a smaller set may be required
                        - full suites might be run at off hours or down times
                            - ci/cd systems have limitations, so these need to be considered
    - health checks
        - Could be a small (or large) subset of tests run at off hours against production deployed code to ensure things are ok
        - Could catch misdeploys, wrong versions, downed host servers, etc
- Environment
    - Environment that the app and the test code runs in is important
        - For example, this app runs in node 14 LTS
        - It may run in other LTS versions (node 12, node 10)
            - But some of the node dependencies may require specific minimum versions
        - If this was running in the same environment as another node app, there may be conflicts in required environment versions
            - This may also be true for test code (external, not unit tests), if written in the same language/running in the same environment
            - App may run in node 14 and require node 14, test automation could run and rely on node 12 and unable to upgrade to node 14
        - Or, this app could be deployed in multiple places, and be compatible with one environment and not the other
    - Solutions
        - Dockerize
            - Own environment, don't have to worry about anything else
        - Run up in the cloud somewhere, make it an api call
            - amazon lambda, etc
        - maintain different versions in different places
            - maintaining multiple versions of a product could literally double work
                - not ideal
- Platforms
    - Browsers
        - Blink, Gecko, and Webkit may all need different consideration for testing
            - Chrome aligns relatively well with w3c standards
            - MS Edge is chromium now, which is nice
            - firefox also aligns relatively well
            - Safari sometimes likes to do its own thing
            - Internet explorer (non edge), like safari, would also need special consideration
        - May need specialized handling in test code (as with all the browsers, but safari/IE especially, firefox/chrome less so)
            ```
                // Somewhere in an early test cycle hook
                const userAgent = window.navigator.userAgent; // Parse and detect browser

                if (userAgent.toLowerCase().includes("Safari")) {
                    global.safari = true; // set this somewhere globally
                }

                // In spec code

                if (global.safari) {
                    // Do safari specific actions
                } else { // Could be else ifs for internet explorer, etc 
                    // Do firefox/chrome actions
                }
            ```
            - If this app had a UI, similiar considerations may exist for mobile (versus tablet) versus desktop
            - Would recommend not to rely on useragent
                - If using something like browserstack/saucelabs, should have configurations and CLI commands that specify browsers/OS/versions
                    - https://wiki.saucelabs.com/display/DOCS/Desired+Capabilities+Required+for+Selenium+and+Appium+Tests
                    - This allows us to run on real world devices as well as specific down to specific versions
                        - Testing older versions of browsers/OS/etc may be required to replicate specific issues
                    - As part of the automation configuration, could define that global variable that flags specific logic paths for safari/etc
                        - more reliable than useragent strings
    - OS
        - Depending on product being released. If the environment the product runs in is a browser, OS is less of a priority than browser
        - For a cli app, things like carriage return/newline or slash (forward or backslash) could be concerns to test and check 
    - Mobile
        - Is this a native app? Is it a webapp wrapped in a container?
        - mobile has special considerations for testing
            - backgrounding/tombstoning/bringing back to foreground
    - The more platforms supported the more testing effort/considerations
- Who's our main audience?
    - If we had metrics, we can use that to guide our prioritization on which platforms are more important to have tests/stable releases/etc
        - We may also get prioritization from company hierarchy (managers, company mandate, etc)