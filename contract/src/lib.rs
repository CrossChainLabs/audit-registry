/*
 * Audit Registry is designed to increase transparency and security in
 * the blockchain and general software space.
 */

use near_sdk::{env, near_bindgen, wee_alloc, AccountId};
use borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::Serialize;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub type Hash = String;
pub type Signature = String;


#[derive(Default, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Auditor {
    account_id: String,
    metadata: Hash,
}

#[derive(Default, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Certificate {
    code_hash: Hash,
    account_id: String,
    signature: Signature,
    standards: Vec<String>,
    advisory_hash: Hash,
    audit_hash: Hash
}

#[derive(Default, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Project {
    code_hash: Hash,
    name: String,
    url: String,
    metadata: Hash,
    status: bool,
    index: u64
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct AuditRegistry {
    auditors: UnorderedMap<AccountId, Auditor>,
    projects: UnorderedMap<Hash, Project>,
    certificates: UnorderedMap<Vec<u8>, Certificate>,
    project_index: u64
}

#[near_bindgen]
impl AuditRegistry {
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "The contract is already initialized");
        Self {
            auditors: UnorderedMap::new(b"a".to_vec()),
            projects: UnorderedMap::new(b"b".to_vec()),
            certificates: UnorderedMap::new(b"c".to_vec()),
            project_index: 0
        }
    }

    /// Register as auditor, linking account_id and metadata that is IPFS/Sia content hash.
    pub fn register_auditor(&mut self, metadata: Hash) -> bool {
        // get account_id
        let account_id = env::predecessor_account_id();
        env::log(format!("register_auditor(): auditor's name is {}", account_id).as_bytes());

        // insert auditor to auditors map
        let auditor = Auditor {
            account_id: account_id.clone(),
            metadata
        };
        let result = self.auditors.insert(&account_id, &auditor);
        match result {
            Some(_value_exists) => {
                env::log(format!("register_auditor(): failed, auditor {} already exists in map", account_id).as_bytes());
                return false;
            },
            None => {}
        }
        
        env::log(format!("register_auditor(): complete").as_bytes());
        return true; 
    }
  
    /// Adding project to the registry. Code hash is used as primary key for certificate information.
    /// All the other information is used for visualization.
    /// Github url can be used to distinguish projects with the same name in UI. 
    pub fn register_project(&mut self, name: String, url: String, metadata: Hash, code_hash: Hash) -> bool  {
        let status = false;
        let index = self.project_index;
        let project = Project {
            code_hash: code_hash.clone(),
            name,
            url,
            metadata,
            status,
            index
        };

        let result = self.projects.insert(&code_hash, &project);
        match result {
            Some(_value_exists) => {
                env::log(format!("register_project(): failed, project already exists").as_bytes());
                return false;
            },
            None => {}
        }
    
        if self.project_index < u64::MAX {
            self.project_index += 1;
        }

        env::log(format!("register_project(): complete").as_bytes());
        return true;
    }
  
    /// Auditor signs given code hash, with their audit_hash and a list of standards this contracts satisfies.
    /// List of standards represent which standards given source code satisfies. It's free form but should be social consensus for specific domains. E.g. in blockchains these will be EIP-* or NEP-*.
    pub fn sign_audit(&mut self, code_hash: Hash, audit_hash: Hash, standards: Vec<String>, signature: Signature) -> bool {
        // get current account_id
        let account_id = env::predecessor_account_id();
        env::log(format!("sign_audit code_hash: {}", code_hash).as_bytes());

        // TODO: check if account_id is auditor
        //let empty_auditor = "".to_string();
        //let metadata = self.auditors.get(&account_id).unwrap_or(empty_auditor);
      
        // calculate certificate's hash
        let certificate_hash = env::sha256((code_hash.clone() + &account_id).as_bytes());

        // check if audit was already signed
        let advisory_hash = "".to_string();
        let certificate = Certificate {
            code_hash,
            account_id,
            signature,
            standards,
            advisory_hash,
            audit_hash
        };
        let result = self.certificates.insert(&certificate_hash, &certificate);
        match result {
            Some(_value_exists) => {
                env::log(format!("sign_audit(): failed, audit was already signed").as_bytes());
                return false;
            },
            None => {}
        }

        env::log(format!("sign_audit(): completed").as_bytes());
        return true;
    }
  
    /// Report advisory for given code hash. Advisory hash is IPFS/Sia content hash.
    /// Only allowed to be done by one of auditors that signed on the given code hash.
    /// It's possible to report advisory first, without posting details to inform users about possible issue and later reveal the details in the disclosure.
    pub fn report_advisory(&mut self, code_hash: Hash, advisory_hash: Hash) {
        // get current account_id
        let current_account_id = env::predecessor_account_id();

        // calculate certificate_hash hash
        let certificate_hash = env::sha256((code_hash.clone() + &current_account_id).as_bytes());

        // add advisory_hash to certificate
        let account_id = "".to_string();
        let signature = "".to_string();
        let standards: Vec<String> = Vec::default();
        let audit_hash = "".to_string();
        let empty_certificate = Certificate {
            code_hash: code_hash.clone(),
            account_id,
            signature,
            standards,
            advisory_hash: advisory_hash.clone(),
            audit_hash
        };
        let mut certificate = self.certificates.get(&certificate_hash).unwrap_or(empty_certificate);
        if !certificate.account_id.is_empty() {
            certificate.advisory_hash = advisory_hash;
            env::log(format!("report_advisory(): certificate_store.advisory_hash is {}", certificate.advisory_hash).as_bytes());

            // set project index
            let name = "".to_string();
            let url = "".to_string();
            let metadata = "".to_string();
            let status = false;
            let index = 0;
            let empty_project = Project {
                code_hash: code_hash.clone(),
                name,
                url,
                metadata,
                status,
                index
            };
            let mut project = self.projects.get(&code_hash).unwrap_or(empty_project);
            if !project.name.is_empty() {
                project.index = self.project_index;

                if self.project_index < u64::MAX {
                    self.project_index += 1;
                }
            }
        }
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
    pub fn get_project_certificates(self, code_hash: Hash) -> Vec<Certificate> {
        let certificates = self.certificates.values_as_vector().to_vec();
        let mut project_certificates: Vec<Certificate> = Vec::new();

        for iter in certificates {
            if iter.code_hash == code_hash {
                project_certificates.push(iter);
            }
        }

        return project_certificates;
    }
}

