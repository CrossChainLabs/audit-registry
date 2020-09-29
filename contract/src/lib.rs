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

use near_sdk::json_types::Base58PublicKey;
use near_sdk::{env, near_bindgen, wee_alloc, AccountId, Balance, Promise, BlockHeight};
use near_sdk::collections::UnorderedMap;
use borsh::{BorshDeserialize, BorshSerialize};
use std::str;

use std::collections::hash_map::DefaultHasher;
use std::hash::{Hasher}; 

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub type Hash = String;
pub type Signature = String;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Auditor {
    account_id: AccountId,
    metadata: Hash, // auditor's metadata
    certificates: UnorderedMap<Hash, Certificate> //code_hash is the primary key
}
/*
impl Clone for Auditor {
    fn clone(&self) -> Auditor {
        return new Auditor(String::from(""),"", null);
    }
}*/

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Certificate {
    signature: Signature,
    standards: Vec<String>,
    advisory_hash: Hash,
    audit_hash: Hash,
    //code_hash: String
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Project {
    name: String,
    url: String,
    metadata: Hash, // project's metadata
    code_hash: Hash
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct AuditRegistry {
    auditors: Vec<Auditor>,
    projects: UnorderedMap<Hash, Project> // code_hash is the key
}

#[near_bindgen]
impl AuditRegistry {
    /// Register as auditor, linking account_id and metadata that is IPFS/Sia content hash.
    fn register_auditor(account_id: AccountId, metadata: Hash) -> bool {
        return true;
    }
  
    /// Adding project to the registry. Code hash is used as primary key for certificate information.
    /// All the other information is used for visualization.
    /// Github url can be used to distinguish projects with the same name in UI. 
    fn register_project(name: String, url: String, metadata: Hash, code_hash: Hash) -> bool {
        return true;
    }
  
    /// Auditor signs given code hash, with their audit_hash and a list of standards this contracts satisfies.
    /// List of standards represent which standards given source code satisfies. It's free form but should be social consensus for specific domains. E.g. in blockchains these will be EIP-* or NEP-*.
    fn sign_audit(code_hash: Hash, audit_hash: Hash, standards: Vec<String>, signature: Signature) -> bool {
        return true;
    }
  
    /// Report advisory for given code hash. Advisory hash is IPFS/Sia content hash.
    /// Only allowed to be done by one of auditors that signed on the given code hash.
    /// It's possible to report advisory first, without posting details to inform users about possible issue and later reveal the details in the disclosure.
    fn report_advisory(code_hash: Hash, advisory_hash: Hash) -> bool {
        return true;
    }
  
    /// List all auditors.
    fn get_auditors_list(&mut self) -> Vec<Auditor> {
        //let mut auditors = self.auditors.clone(); //&self.auditors;
        //return auditors.to_vec(&self);
        return self.auditors;
    }
  
    /// List all projects.
    fn get_projects_list(&mut self) -> Vec<Project> {
        let projects: Vec<Project> = Vec::new();
        // TODO: populate with projects
        return projects;
    }
   
    /// List certificates for given project.
    fn get_project_certifcates(&mut self, code_hash: Hash) -> Vec<Certificate> {
        let certificates: Vec<Certificate> = Vec::new();
        // TODO: populate with projects
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
#[cfg(test)]
mod tests {
    use super::*;
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
}
