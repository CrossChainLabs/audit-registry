/*
 * Audit Registry is designed to increase transparency and security in
 * the blockchain and general software space.
 */

use near_sdk::{env, near_bindgen, wee_alloc, AccountId};
use std::collections::HashMap;
use borsh::{BorshDeserialize, BorshSerialize};
use serde::Serialize;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub type Hash = String;
pub type Signature = String;


#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct AuditorStore {
    metadata: Hash,
    certificates: HashMap<Hash, CertificateStore>,
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct Auditor {
    account_id: String,
    metadata: Hash,
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
    store: CertificateStore
}


#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct ProjectStore {
    name: String,
    url: String,
    metadata: Hash,
    status: bool,
    index: u64
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct Project {
    code_hash: Hash,
    store: ProjectStore
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
pub struct AuditRegistry {
    auditors: HashMap<AccountId, AuditorStore>,
    projects: HashMap<Hash, ProjectStore>,
    project_index: u64
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
        env::log(format!("Register_auditor: {}", current_account_id).as_bytes());
        if account_id.ne(&current_account_id) {
            env::log(format!("Current register auditor not equal to: {}", account_id).as_bytes());
            return;
        }

        // check if code_hash already exists
        if self.auditors.contains_key(&account_id) {
            env::log(format!("Register_auditor already signed").as_bytes());
            return;
        }

        // insert auditor to auditors map
        self.auditors.insert(account_id, AuditorStore {
            metadata,
            certificates: HashMap::new()
        });
        env::log(format!("Register_auditor completed").as_bytes());
    }
  
    /// Adding project to the registry. Code hash is used as primary key for certificate information.
    /// All the other information is used for visualization.
    /// Github url can be used to distinguish projects with the same name in UI. 
    pub fn register_project(&mut self, name: String, url: String, metadata: Hash, code_hash: Hash)  {
        // check if code_hash already exists
        if self.projects.contains_key(&code_hash) {
            return;
        }

        self.projects.insert(code_hash, ProjectStore {
            name,
            url,
            metadata,
            status: false,
            index: self.project_index});
    
        if self.project_index < u64::MAX {
            self.project_index += 1;
        }
    }
  
    /// Auditor signs given code hash, with their audit_hash and a list of standards this contracts satisfies.
    /// List of standards represent which standards given source code satisfies. It's free form but should be social consensus for specific domains. E.g. in blockchains these will be EIP-* or NEP-*.
    pub fn sign_audit(&mut self, code_hash: Hash, audit_hash: Hash, standards: Vec<String>, signature: Signature) {
        // get current account_id
        let current_account_id = env::predecessor_account_id();
        env::log(format!("sign_audit code_hash: {}", code_hash).as_bytes());

        // find auditor
        match self.auditors.get_mut(&current_account_id) {
            Some(auditor) => {
                if auditor.certificates.contains_key(&code_hash) {
                    env::log(format!("sign_audit auditor already signed").as_bytes());
                    return;
                }

                env::log(format!("sign_audit auditor: {}", current_account_id).as_bytes());
                match self.projects.get_mut(&code_hash) {
                    Some(project) => {
                        env::log(format!("sign_audit project.status: {}", project.status).as_bytes());
                        project.status = true; //true = completed
                        project.index = self.project_index;

                        if self.project_index < u64::MAX {
                            self.project_index += 1;
                        }
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
                env::log(format!("sign_audit completed").as_bytes());
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
                if !auditor_store.certificates.contains_key(&code_hash) {
                    return;
                }

                // add advisory_hash to certificate
                match auditor_store.certificates.get_mut(&code_hash) {
                Some(certificate_store) => {   
                    env::log(format!("advisory_hash: {}", advisory_hash).as_bytes());
                    certificate_store.advisory_hash = advisory_hash;
                    env::log(format!("certificate_store.advisory_hash: {}", certificate_store.advisory_hash).as_bytes());

                    match self.projects.get_mut(&code_hash) {
                        Some(project) => {
                            project.index = self.project_index;
    
                            if self.project_index < u64::MAX {
                                self.project_index += 1;
                            }
                        },
                        None => {}
                    }
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
                store: project
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
                    store: CertificateStore{ 
                        code_hash: certificate.code_hash.clone(), 
                        signature: certificate.signature.clone(), 
                        standards: certificate.standards.clone(), 
                        advisory_hash: certificate.advisory_hash.clone(), 
                        audit_hash: certificate.audit_hash.clone()
                    }
                });
            }
        }
        return certificates;
    }
}

