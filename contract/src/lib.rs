/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

use near_sdk::{env, near_bindgen, wee_alloc, AccountId};
use near_sdk::collections::UnorderedMap;
use near_sdk::collections::Vector;
use borsh::{BorshDeserialize, BorshSerialize};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub type Hash = String;
pub type Signature = String;

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Auditor {
    metadata: Hash, // auditor's metadata
    certificates: UnorderedMap<Hash, Certificate> //code_hash is the primary key
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Certificate {
    signature: Signature,
    standards: Vector<String>,
    advisory_hash: Hash,
    audit_hash: Hash
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Project {
    name: String,
    url: String,
    metadata: Hash, // project's metadata
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct AuditRegistry {
    auditors: UnorderedMap<AccountId, Auditor>,
    projects: UnorderedMap<Hash, Project>
}

impl AuditRegistry {
    pub fn new() -> Self {
        Self {
            auditors: UnorderedMap::new(b"a".to_vec()),
            projects: UnorderedMap::new(b"b".to_vec())
        }
    }

    /// Register as auditor, linking account_id and metadata that is IPFS/Sia content hash.
    pub fn register_auditor(&mut self, account_id: AccountId, metadata: Hash) -> bool {
        let new_auditor = Auditor {
            metadata,
            certificates: UnorderedMap::new(b"r".to_vec())
        };

        // check that the logged in account_id is the same with the provided one
        let current_account_id = env::predecessor_account_id();
        if account_id.ne(&current_account_id) {
            return false;
        }

        // insert auditor to auditors map
        let result = self.auditors.insert(&account_id, &new_auditor);
        match result {
            Some(_value_exists) => return false,
            None => return true
        }
    }
  
    /// Adding project to the registry. Code hash is used as primary key for certificate information.
    /// All the other information is used for visualization.
    /// Github url can be used to distinguish projects with the same name in UI. 
    pub fn register_project(&mut self, name: String, url: String, metadata: Hash, code_hash: Hash) -> bool {
        let new_project = Project {
            name,
            url,
            metadata
        };

        let result = self.projects.insert(&code_hash, &new_project);
        match result {
            Some(_value_exists) => return false,
            None => return true
        }
    }
  
    /// Auditor signs given code hash, with their audit_hash and a list of standards this contracts satisfies.
    /// List of standards represent which standards given source code satisfies. It's free form but should be social consensus for specific domains. E.g. in blockchains these will be EIP-* or NEP-*.
    pub fn sign_audit(self, code_hash: Hash, audit_hash: Hash, standards: Vector<String>, signature: Signature) -> bool {
        // get current account_id
        let current_account_id = env::predecessor_account_id();

        let mut code_hash_prefix = code_hash.as_bytes().to_vec();
        code_hash_prefix.extend_from_slice(b":b");
        let certificates: UnorderedMap<Hash, Certificate> = UnorderedMap::new(code_hash_prefix);

        let metadata = "".to_string();
        let empty_auditor = Auditor{ metadata, certificates };
        let mut auditor = self.auditors.get(&current_account_id).unwrap_or(empty_auditor);

        if auditor.metadata == "" {
            return false;
        }

        let advisory_hash = "".to_string();
        let certificate = Certificate{ signature, standards, advisory_hash, audit_hash };

        let result = auditor.certificates.insert(&code_hash, &certificate);
        match result {
            Some(_value_exists) => return false,
            None => return true
        }
    }
  
    /// Report advisory for given code hash. Advisory hash is IPFS/Sia content hash.
    /// Only allowed to be done by one of auditors that signed on the given code hash.
    /// It's possible to report advisory first, without posting details to inform users about possible issue and later reveal the details in the disclosure.
    pub fn report_advisory(self, code_hash: Hash, advisory_hash: Hash) -> bool {
        // create a new certificate
        let mut code_hash_prefix = code_hash.as_bytes().to_vec();
        code_hash_prefix.extend_from_slice(b":b");
        let certificates: UnorderedMap<Hash, Certificate> = UnorderedMap::new(code_hash_prefix);

        // get the auditor the corresponds to the current account_id
        let current_account_id = env::predecessor_account_id();
        let metadata = "".to_string();
        let empty_auditor = Auditor{ metadata, certificates };
        let auditor = self.auditors.get(&current_account_id).unwrap_or(empty_auditor);
        if auditor.metadata == "" {
            return false;
        }

        // save a temporary advisory_hash
        let advisory_temp = advisory_hash.clone();

        // get the certificate that requires the advisory_hash
        let signature = "".to_string();
        let standards = Vector::default();
        let advisory_hash = "".to_string();
        let audit_hash = "".to_string();
        let empty_certificate = Certificate{ signature, standards, advisory_hash, audit_hash };
        let mut certificate = auditor.certificates.get(&code_hash).unwrap_or(empty_certificate);
        if certificate.signature == "" || certificate.advisory_hash == "" || certificate.audit_hash == "" {
            return false;
        }

        // report advisory
        certificate.advisory_hash = advisory_temp;
        return true;
    }
  
    /// List all auditors.
    pub fn get_auditors_list(self) -> Vec<Auditor> {
        let auditors = self.auditors.values_as_vector().to_vec();
        return auditors;
    }
  
    /// List all projects.
    pub fn get_projects_list(self) -> Vec<Project> {
        let projects = self.projects.values_as_vector().to_vec();
        return projects;
    }
   
    /// List certificates for given project.
    pub fn get_project_certificates(&mut self, code_hash: Hash) -> Vec<Certificate> {
        // list auditors and get certificates for the given code_hash
        let mut certificates: Vec<Certificate> = Vec::new();
        let auditors = self.auditors.values_as_vector().to_vec();
        for auditor in &auditors {
            let signature = "".to_string();
            let standards = Vector::default();
            let advisory_hash = "".to_string();
            let audit_hash = "".to_string();
            let empty_certificate = Certificate{ signature, standards, advisory_hash, audit_hash };
            let certificate = auditor.certificates.get(&code_hash).unwrap_or(empty_certificate);

            if certificate.signature != "" && certificate.advisory_hash != "" && certificate.audit_hash != "" {
                certificates.push(certificate);
            }
        }

        return certificates;
    }
  }
  

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    //use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }
/*
    #[test]
    fn set_then_get_greeting() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(
            "howdy".to_string(),
            contract.get_greeting("bob_near".to_string())
        );
    }

    #[test]
    fn get_default_greeting() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Welcome::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            "Hello".to_string(),
            contract.get_greeting("francis.near".to_string())
        );
    }
    */
}
