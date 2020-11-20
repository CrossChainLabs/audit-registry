# audit-registry

Audit Registry is designed to increase transparency and security in the blockchain and general software space.
Blockchain space is becoming increasingly complex, with more and more software being built that handles millions and billions of dollars in value.

At the same time, all code is open source which has positive and negative sides to security.
Positive side this allows anyone to study the code and assess the logic and security of the network themself. On the other hand, there are not that many people who are actually able to do it. But malicious actors now have clear visibility into how everything works, can craft sophisticated attacks “offline” without triggering any alarms. Compared to centralized services, where studying a system would probably lead to security team reaction.

The crypto space has been employing security audits as a means to let external and professional eyes look at the code first before it gets released. Usually it’s an expensive and laborious task. 

One of interesting sides of this, is that in opposition to centralized services that over time try to reduce external dependencies, this leads in the blockchain / Open Web world to more composability of applications. Developers rely on existing libraries, applications and services instead of rebuilding their functionality as part of their own app.

But there is a problem, there is no way to actually ensure the quality of the library or service you are relying upon. One needs to review it oneself, while not having either time or resources to do  it usually. This is even more true on the edges of composability, where contracts or applications start to use each other in unexpected ways.

There is also an issue with quality of security review and accountability. Even though most professional firms always stand by their work, it’s easy to save money and go with someone who might not provide full visibility into their previous work and clients. And even more complex, if you want to use an application that was reviewed by a firm that you yourself don’t have direct experience. You don’t have any data on their previous work, quality and professionalism. It’s hard to make a judgment based on lack of data.

Idea of the Audit Registry is to add accountability and visibility of which applications were reviewed and by whom.

It’s a simple contract, where audit and security agencies can register their firm and issue “audit findings” in the form <hash of code, hash of the audit report, list of compliant standards, their signature> per library, application.

This allows to handle various cases that are pretty common in the space:
  - Dependency code review, that is used by many different parties.  For example a crypto library in Rust, it’s used by many projects and probably there was multiple reviews of it at different times, but there is no fact of that recorded anywhere.
  - Code review for a contract that is being used as a fundamental building block. Something like Uniswap, it would be great to know that exact code that millions of dollars were deposited has been reviewed by 2-3 various firms.
  - Sometimes developers don’t provide the report to the public which highlights some flaws. If a breach ends up happening with this flaw, there is defensibility on the side of the security review firm that they reported it and it was up to the developer to not expose such a report and it’s users to not require it.
  - Audit findings including list of standards that a contract or a service comply with. This allows to add extra checks when relying in the other tools and software on that vs just on function names / ABI matching.
  - Report security advisory for all the subscribed to the registry, without first revealing the full content of it. Committing to the hash of the advisory first will inform interested parties (like wallets) about possible issues with given software. Later after the issue was mitigated, the advisory can be revealed as part of the disclosure policy.

This registry can also become a valuable service for tools in the ecosystem. For example if we are looking at the wallet applications or recent issues with Uniswap frontend and ImBTC. It’s very frequent that frontends need to have a way to check at least some authority on security and standard compliance (e.g. ImBTC was ERC777 instead of expected by Uniswap ERC20). In NEAR this will be important from the start, as smart contracts are used for delegation. Which means before any UI whitelists a validator that uses a custom contract - they need to check that it actually satisfies staking pool standard.

To drive this forward, NEAR will be the first user, posting security reviews of it’s contracts to this registry. We will also encourage various other software like wallets to use this registry to show information about contracts that are used in signed transactions.

Reference

https://github.com/crev-dev/cargo-crev
