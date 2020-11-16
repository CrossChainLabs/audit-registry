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
use std::collections::HashMap;
use borsh::{BorshDeserialize, BorshSerialize};
use serde::Serialize;
use log::{info};

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub type Hash = String;
pub type Signature = String;


#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct AuditorStore {
    metadata: Hash, // auditor's metadata
    certificates:  HashMap<Hash, CertificateStore>, //code_hash is the primary key
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct Auditor {
    account_id: String,
    metadata: Hash, // auditor's metadata
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct CertificateStore {
    code_hash: Hash,
    signature: Signature,
    standards: Vec<String>,
    advisory_hash: Hash,
    audit_hash: Hash
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct Certificate {
    auditor: String,
    code_hash: Hash,
    signature: Signature,
    standards: Vec<String>,
    advisory_hash: Hash,
    audit_hash: Hash
}


#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct ProjectStore {
    name: String,
    url: String,
    metadata: Hash, // project's metadata
    status: bool,
    index: u32
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct Project {
    code_hash: Hash,
    name: String,
    url: String,
    metadata: Hash, // project's metadata
    status: bool,
    index: u32
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct AuditRegistry {
    auditors: HashMap<AccountId, AuditorStore>,
    projects: HashMap<Hash, ProjectStore>,
    project_index: u32
}

#[near_bindgen]
impl AuditRegistry {
    pub fn new() -> Self {
        Self {
            auditors: HashMap::new(),
            projects: HashMap::new(),
            project_index: 0
        }
    }

    /// Register as auditor, linking account_id and metadata that is IPFS/Sia content hash.
    pub fn register_auditor(&mut self, account_id: AccountId, metadata: Hash) {
        // check that the logged in account_id is the same with the provided one
        let current_account_id = env::predecessor_account_id();
        info!("Register_auditor: {}", current_account_id);
        if account_id.ne(&current_account_id) {
            info!("Current register auditor not equal to: {}", account_id);
            return;
        }

        //check if code_hash already exists
        if self.auditors.contains_key(&account_id) {
            info!("Register_auditor already signed");
            return;
        }

        // insert auditor to auditors map
        self.auditors.insert(account_id, AuditorStore {
            metadata,
            certificates: HashMap::new()
        });
        info!("Register_auditor completed");
    }
  
    /// Adding project to the registry. Code hash is used as primary key for certificate information.
    /// All the other information is used for visualization.
    /// Github url can be used to distinguish projects with the same name in UI. 
    pub fn register_project(&mut self, name: String, url: String, metadata: Hash, code_hash: Hash)  {
        //check if code_hash already exists
        if self.projects.contains_key(&code_hash) {
            return;
        }

        self.projects.insert(code_hash, ProjectStore {
            name,
            url,
            metadata,
            status: false,
            index: self.project_index});
    
        if self.project_index < u32::MAX {
            self.project_index += 1;
        }
    }
  
    /// Auditor signs given code hash, with their audit_hash and a list of standards this contracts satisfies.
    /// List of standards represent which standards given source code satisfies. It's free form but should be social consensus for specific domains. E.g. in blockchains these will be EIP-* or NEP-*.
    pub fn sign_audit(&mut self, code_hash: Hash, audit_hash: Hash, standards: Vec<String>, signature: Signature) {
        // get current account_id
        let current_account_id = env::predecessor_account_id();
        info!("sign_audit code_hash: {}", code_hash);

        //find auditor
        match self.auditors.get_mut(&current_account_id) {
            Some(auditor) => {
                if auditor.certificates.contains_key(&code_hash) {
                    info!("sign_audit auditor already signed");
                    return;
                }

                info!("sign_audit auditor: {}", current_account_id);
                match self.projects.get_mut(&code_hash) {
                    Some(project) => {
                        info!("sign_audit project.status: {}", project.status);
                        project.status = true; //true = completed
                    },
                    None => {}
                }

                let advisory_hash = "".to_string();
                auditor.certificates.insert(code_hash.clone(), CertificateStore { 
                    code_hash, 
                    signature, 
                    standards, 
                    advisory_hash, 
                    audit_hash });
                info!("sign_audit completed");  
            },
            None => {}
        }
    }
  
    /// Report advisory for given code hash. Advisory hash is IPFS/Sia content hash.
    /// Only allowed to be done by one of auditors that signed on the given code hash.
    /// It's possible to report advisory first, without posting details to inform users about possible issue and later reveal the details in the disclosure.
    pub fn report_advisory(&mut self, code_hash: Hash, advisory_hash: Hash) {
         // get current account_id
         let current_account_id = env::predecessor_account_id();

         //find auditor
         match self.auditors.get_mut(&current_account_id) {
            Some(auditor_store) => {
                if auditor_store.certificates.contains_key(&code_hash) {
                    return;
                }

                // add advisory_hash to certificate
                match auditor_store.certificates.get_mut(&code_hash) {
                Some(certificate_store) => {   
                    certificate_store.advisory_hash = advisory_hash;
                },
                None => {}
                }
             },
            None => {}
         }
    }
  
    /// List all auditors.
    pub fn get_auditors_list(self) -> Vec<Auditor> {
        let mut auditors = Vec::new();

        for (key, auditor) in self.auditors {
            auditors.push(Auditor{account_id:key, metadata: auditor.metadata});
        }
        return auditors;
    }
  
    /// List all projects.
    pub fn get_projects_list(self) -> Vec<Project> {
        let mut projects = Vec::new();

        for (key, project) in self.projects {
            projects.push(Project {
                code_hash: key,
                name: project.name,
                url: project.url,
                metadata: project.metadata,
                status: project.status,
                index: project.index
            });
        }
        return projects;
    }
   
    /// List certificates for given project.
    pub fn get_project_certificates(self, code_hash: Hash) -> Vec<Certificate> {
        let mut certificates = Vec::new();

        for (key, auditor) in self.auditors {
            if let Some(certificate) = auditor.certificates.get(&code_hash) {

                certificates.push(Certificate {
                    auditor: key,
                    code_hash: code_hash.clone(),
                    signature: certificate.signature.clone(),
                    standards: certificate.standards.clone(),
                    advisory_hash: certificate.advisory_hash.clone(),
                    audit_hash: certificate.audit_hash.clone()
                });
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
