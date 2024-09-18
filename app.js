// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaJVzCC3AS-FVj6HV85Ha8cIDko-HdgGo",
    authDomain: "voting-96a43.firebaseapp.com",
    projectId: "voting-96a43",
    storageBucket: "voting-96a43.appspot.com",
    messagingSenderId: "173608274109",
    appId: "1:173608274109:web:2abea9f0f45c09d6f78fd4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const userRegisterForm = document.getElementById('userRegisterForm');
const userLoginForm = document.getElementById('userLoginForm');
const officerRegisterForm = document.getElementById('officerRegisterForm');
const officerLoginForm = document.getElementById('officerLoginForm');
const logoutBtn = document.getElementById('logoutBtn');

// User Dashboard Elements
const applyVoterIdBtn = document.getElementById('applyVoterIdBtn');
const checkVoterIdStatusBtn = document.getElementById('checkVoterIdStatusBtn');
const requestCorrectionBtn = document.getElementById('requestCorrectionBtn');
const checkCorrectionStatusBtn = document.getElementById('checkCorrectionStatusBtn');
const onlineVotingBtn = document.getElementById('onlineVotingBtn');
const viewElectionsBtn = document.getElementById('viewElectionsBtn');
const viewResultsBtn = document.getElementById('viewResultsBtn');

// Officer Dashboard Elements
const manageVoterIdBtn = document.getElementById('manageVoterIdBtn');
const manageCorrectionsBtn = document.getElementById('manageCorrectionsBtn');
const manageCandidatesBtn = document.getElementById('manageCandidatesBtn');
const generateVoterIdBtn = document.getElementById('generateVoterIdBtn');
const declareResultsBtn = document.getElementById('declareResultsBtn');

// Modal Elements
const voterIdModal = document.getElementById('voterIdModal');
const correctionModal = document.getElementById('correctionModal');
const votingModal = document.getElementById('votingModal');
const manageVoterIdModal = document.getElementById('manageVoterIdModal');
const manageCorrectionsModal = document.getElementById('manageCorrectionsModal');
const manageCandidatesModal = document.getElementById('manageCandidatesModal');
const generateVoterIdModal = document.getElementById('generateVoterIdModal');
const declareResultsModal = document.getElementById('declareResultsModal');
const viewResultsModal = document.getElementById('viewResultsModal');

// Close buttons for modals
const closeButtons = document.getElementsByClassName('close');

// User Registration
if (userRegisterForm) {
    userRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = userRegisterForm['name'].value;
        const email = userRegisterForm['email'].value;
        const password = userRegisterForm['password'].value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return db.collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    role: 'user'
                });
            })
            .then(() => {
                userRegisterForm.reset();
                window.location.href = 'user-dashboard.html';
            })
            .catch((error) => {
                console.error('Error registering user:', error);
                alert('Error registering user: ' + error.message);
            });
    });
}

// User Login
if (userLoginForm) {
    userLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = userLoginForm['email'].value;
        const password = userLoginForm['password'].value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                userLoginForm.reset();
                window.location.href = 'user-dashboard.html';
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                alert('Error logging in: ' + error.message);
            });
    });
}

// Officer Registration
if (officerRegisterForm) {
    officerRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = officerRegisterForm['name'].value;
        const email = officerRegisterForm['email'].value;
        const password = officerRegisterForm['password'].value;
        const officerId = officerRegisterForm['officerId'].value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return db.collection('officers').doc(user.uid).set({
                    name: name,
                    email: email,
                    officerId: officerId,
                    role: 'officer'
                });
            })
            .then(() => {
                officerRegisterForm.reset();
                window.location.href = 'officer-dashboard.html';
            })
            .catch((error) => {
                console.error('Error registering officer:', error);
                alert('Error registering officer: ' + error.message);
            });
    });
}

// Officer Login
if (officerLoginForm) {
    officerLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = officerLoginForm['email'].value;
        const password = officerLoginForm['password'].value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                officerLoginForm.reset();
                window.location.href = 'officer-dashboard.html';
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                alert('Error logging in: ' + error.message);
            });
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error logging out:', error);
                alert('Error logging out: ' + error.message);
            });
    });
}

// Check user authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        const userInfo = document.getElementById('userInfo');
        const officerInfo = document.getElementById('officerInfo');
        
        if (userInfo || officerInfo) {
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        if (userInfo) {
                            userInfo.innerHTML = `<p>Welcome, ${data.name}!</p>`;
                        }
                    } else {
                        return db.collection('officers').doc(user.uid).get();
                    }
                })
                .then((doc) => {
                    if (doc && doc.exists) {
                        const data = doc.data();
                        if (officerInfo) {
                            officerInfo.innerHTML = `<p>Welcome, Officer ${data.name}!</p>`;
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    } else {
        // User is signed out
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
    }
});

// Apply for Voter ID
if (applyVoterIdBtn && voterIdModal) {
    applyVoterIdBtn.addEventListener('click', () => {
        voterIdModal.style.display = 'block';
    });
}

// Voter ID Application Form Submission
const voterIdForm = document.getElementById('voterIdForm');
if (voterIdForm) {
    voterIdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            const voterIdApplication = {
                name: voterIdForm['name'].value,
                fatherName: voterIdForm['fatherName'].value,
                motherName: voterIdForm['motherName'].value,
                dob: voterIdForm['dob'].value,
                mobileNumber: voterIdForm['mobileNumber'].value,
                address: voterIdForm['address'].value,
                status: 'pending',
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            db.collection('voterIdApplications').add(voterIdApplication)
                .then(() => {
                    voterIdForm.reset();
                    voterIdModal.style.display = 'none';
                    alert('Voter ID application submitted successfully!');
                })
                .catch((error) => {
                    console.error('Error submitting application:', error);
                    alert('Error submitting application: ' + error.message);
                });
        } else {
            alert('You must be logged in to submit an application.');
        }
    });
}

// Check Voter ID Status
if (checkVoterIdStatusBtn) {
    checkVoterIdStatusBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            db.collection('voterIdApplications')
                .where('userId', '==', user.uid)
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0];
                        const data = doc.data();
                        alert(`Your Voter ID application status: ${data.status}`);
                    } else {
                        alert('No Voter ID application found.');
                    }
                })
                .catch((error) => {
                    console.error('Error checking status:', error);
                    alert('Error checking status: ' + error.message);
                });
        } else {
            alert('You must be logged in to check your application status.');
        }
    });
}

// Request Voter ID Correction
if (requestCorrectionBtn && correctionModal) {
    requestCorrectionBtn.addEventListener('click', () => {
        correctionModal.style.display = 'block';
    });
}

// Voter ID Correction Form Submission
const correctionForm = document.getElementById('correctionForm');
if (correctionForm) {
    correctionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            const correctionRequest = {
                voterIdNumber: correctionForm['voterIdNumber'].value,
                correctionField: correctionForm['correctionField'].value,
                correctionValue: correctionForm['correctionValue'].value,
                status: 'pending',
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            db.collection('voterIdCorrections').add(correctionRequest)
                .then(() => {
                    correctionForm.reset();
                    correctionModal.style.display = 'none';
                    alert('Correction request submitted successfully!');
                })
                .catch((error) => {
                    console.error('Error submitting correction request:', error);
                    alert('Error submitting correction request: ' + error.message);
                });
        } else {
            alert('You must be logged in to submit a correction request.');
        }
    });
}

// Check Correction Status
if (checkCorrectionStatusBtn) {
    checkCorrectionStatusBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            db.collection('voterIdCorrections')
                .where('userId', '==', user.uid)
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0];
                        const data = doc.data();
                        alert(`Your correction request status: ${data.status}`);
                    } else {
                        alert('No correction request found.');
                    }
                })
                .catch((error) => {
                    console.error('Error checking correction status:', error);
                    alert('Error checking correction status: ' + error.message);
                });
        } else {
            alert('You must be logged in to check your correction request status.');
        }
    });
}

// Online Voting
if (onlineVotingBtn && votingModal) {
    onlineVotingBtn.addEventListener('click', () => {
        loadCandidates();
        votingModal.style.display = 'block';
    });
}

// Load Candidates for Voting
function loadCandidates() {
    const candidatesList = document.getElementById('candidatesList');
    if (candidatesList) {
        db.collection('candidates').get()
            .then((querySnapshot) => {
                candidatesList.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    const candidate = doc.data();
                    const candidateElement = document.createElement('div');
                    candidateElement.innerHTML = `
                        <input type="radio" name="candidate" value="${doc.id}" id="${doc.id}">
                        <label for="${doc.id}">${candidate.name} - ${candidate.party}</label>
                    `;
                    candidatesList.appendChild(candidateElement);
                });
            })
            .catch((error) => {
                console.error('Error loading candidates:', error);
                alert('Error loading candidates: ' + error.message);
            });
    }
}

// Submit Vote
// Submit Vote
const votingForm = document.getElementById('votingForm');
if (votingForm) {
    votingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
        if (selectedCandidate) {
            const user = auth.currentUser;
            if (user) {
                const candidateId = selectedCandidate.value;
                
                // First, check if the user has already voted
                db.collection('userVotes').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            throw new Error("You have already voted.");
                        }
                        
                        // If the user hasn't voted, proceed with the voting process
                        return db.runTransaction((transaction) => {
                            const candidateRef = db.collection('candidates').doc(candidateId);
                            return transaction.get(candidateRef).then((candidateDoc) => {
                                if (!candidateDoc.exists) {
                                    throw new Error("Candidate does not exist.");
                                }
                                const newVoteCount = (candidateDoc.data().voteCount || 0) + 1;
                                transaction.update(candidateRef, { voteCount: newVoteCount });
                                
                                // Set the user's vote
                                const userVoteRef = db.collection('userVotes').doc(user.uid);
                                transaction.set(userVoteRef, { 
                                    candidateId: candidateId, 
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp() 
                                });
                            });
                        });
                    })
                    .then(() => {
                        votingModal.style.display = 'none';
                        alert('Your vote has been submitted successfully!');
                    })
                    .catch((error) => {
                        console.error('Error submitting vote:', error);
                        alert('Error submitting vote: ' + error.message);
                    });
            } else {
                alert('You must be logged in to vote.');
            }
        } else {
            alert('Please select a candidate before submitting your vote.');
        }
    });
}

// View Elections
if (viewElectionsBtn) {
    viewElectionsBtn.addEventListener('click', () => {
        db.collection('elections').get()
            .then((querySnapshot) => {
                let electionsInfo = 'Upcoming Elections:\n\n';
                querySnapshot.forEach((doc) => {
                    const election = doc.data();
                    electionsInfo += `${election.name} - Date: ${election.date}\n`;
                });
                alert(electionsInfo);
            })
            .catch((error) => {
                console.error('Error fetching elections:', error);
                alert('Error fetching elections: ' + error.message);
            });
    });
}

// Officer Dashboard Functionality

// Manage Voter ID Applications
if (manageVoterIdBtn && manageVoterIdModal) {
    manageVoterIdBtn.addEventListener('click', () => {
        loadVoterIdApplications();
        manageVoterIdModal.style.display = 'block';
    });
}

function loadVoterIdApplications() {
    const applicationsList = document.getElementById('voterIdApplicationsList');
    if (applicationsList) {
        db.collection('voterIdApplications')
            .where('status', '==', 'pending')
            .get()
            .then((querySnapshot) => {
                applicationsList.innerHTML = '';
                if (querySnapshot.empty) {
                    applicationsList.innerHTML = '<p>No pending applications.</p>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const application = doc.data();
                        const applicationElement = document.createElement('div');
                        applicationElement.className = 'application-item';
                        applicationElement.innerHTML = `
                            <p>Name: ${application.name}</p>
                            <p>Father's Name: ${application.fatherName}</p>
                            <p>Mother's Name: ${application.motherName}</p>
                            <p>DOB: ${application.dob}</p>
                            <p>Mobile: ${application.mobileNumber}</p>
                            <p>Address: ${application.address}</p>
                            <button onclick="approveVoterId('${doc.id}')" class="btn btn-success">Approve</button>
                            <button onclick="rejectVoterId('${doc.id}')" class="btn btn-danger">Reject</button>
                        `;
                        applicationsList.appendChild(applicationElement);
                    });
                }
            })
            .catch((error) => {
                console.error('Error loading voter ID applications:', error);
                applicationsList.innerHTML = '<p>Error loading applications. Please try again.</p>';
            });
    }
}

function approveVoterId(applicationId) {
    db.collection('voterIdApplications').doc(applicationId).update({
        status: 'approved'
    })
    .then(() => {
        alert('Voter ID application approved successfully!');
        loadVoterIdApplications();
    })
    .catch((error) => {
        console.error('Error approving voter ID application:', error);
        alert('Error approving voter ID application: ' + error.message);
    });
}

function rejectVoterId(applicationId) {
    db.collection('voterIdApplications').doc(applicationId).update({
        status: 'rejected'
    })
    .then(() => {
        alert('Voter ID application rejected.');
        loadVoterIdApplications();
    })
    .catch((error) => {
        console.error('Error rejecting voter ID application:', error);
        alert('Error rejecting voter ID application: ' + error.message);
    });
}

// Manage Voter ID Corrections
if (manageCorrectionsBtn && manageCorrectionsModal) {
    manageCorrectionsBtn.addEventListener('click', () => {
        loadVoterIdCorrections();
        manageCorrectionsModal.style.display = 'block';
    });
}

function loadVoterIdCorrections() {
    const correctionsList = document.getElementById('voterIdCorrectionsList');
    if (correctionsList) {
        db.collection('voterIdCorrections')
            .where('status', '==', 'pending')
            .get()
            .then((querySnapshot) => {
                correctionsList.innerHTML = '';
                if (querySnapshot.empty) {
                    correctionsList.innerHTML = '<p>No pending correction requests.</p>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const correction = doc.data();
                        const correctionElement = document.createElement('div');
                        correctionElement.className = 'correction-item';
                        correctionElement.innerHTML = `
                            <p>Voter ID: ${correction.voterIdNumber}</p>
                            <p>Field to Correct: ${correction.correctionField}</p>
                            <p>New Value: ${correction.correctionValue}</p>
                            <button onclick="approveCorrection('${doc.id}')" class="btn btn-success">Approve</button>
                            <button onclick="rejectCorrection('${doc.id}')" class="btn btn-danger">Reject</button>
                        `;
                        correctionsList.appendChild(correctionElement);
                    });
                }
            })
            .catch((error) => {
                console.error('Error loading voter ID corrections:', error);
                correctionsList.innerHTML = '<p>Error loading correction requests. Please try again.</p>';
            });
    }
}

function approveCorrection(correctionId) {
    db.collection('voterIdCorrections').doc(correctionId).update({
        status: 'approved'
    })
    .then(() => {
        alert('Correction request approved successfully!');
        loadVoterIdCorrections();
    })
    .catch((error) => {
        console.error('Error approving correction request:', error);
        alert('Error approving correction request: ' + error.message);
    });
}

function rejectCorrection(correctionId) {
    db.collection('voterIdCorrections').doc(correctionId).update({
        status: 'rejected'
    })
    .then(() => {
        alert('Correction request rejected.');
        loadVoterIdCorrections();
    })
    .catch((error) => {
        console.error('Error rejecting correction request:', error);
        alert('Error rejecting correction request: ' + error.message);
    });
}

// Manage Candidates
if (manageCandidatesBtn && manageCandidatesModal) {
    manageCandidatesBtn.addEventListener('click', () => {
        loadCandidatesForManagement();
        manageCandidatesModal.style.display = 'block';
    });
}

function loadCandidatesForManagement() {
    const candidatesList = document.getElementById('candidatesList');
    if (candidatesList) {
        db.collection('candidates').get()
            .then((querySnapshot) => {
                candidatesList.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    const candidate = doc.data();
                    const candidateElement = document.createElement('div');
                    candidateElement.className = 'candidate-item';
                    candidateElement.innerHTML = `
                        <p>Name: ${candidate.name}</p>
                        <p>Party: ${candidate.party}</p>
                        <p>Votes: ${candidate.voteCount || 0}</p>
                        <button onclick="removeCandidate('${doc.id}')" class="btn btn-danger">Remove</button>
                    `;
                    candidatesList.appendChild(candidateElement);
                });
            })
            .catch((error) => {
                console.error('Error loading candidates:', error);
                alert('Error loading candidates: ' + error.message);
            });
    }
}

// Add Candidate
const addCandidateForm = document.getElementById('addCandidateForm');
if (addCandidateForm) {
    addCandidateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newCandidate = {
            name: addCandidateForm['candidateName'].value,
            party: addCandidateForm['candidateParty'].value,
            voteCount: 0
        };
        db.collection('candidates').add(newCandidate)
            .then(() => {
                addCandidateForm.reset();
                loadCandidatesForManagement();
                alert('Candidate added successfully!');
            })
            .catch((error) => {
                console.error('Error adding candidate:', error);
                alert('Error adding candidate: ' + error.message);
            });
    });
}

function removeCandidate(candidateId) {
    db.collection('candidates').doc(candidateId).delete()
        .then(() => {
            loadCandidatesForManagement();
            alert('Candidate removed successfully!');
        })
        .catch((error) => {
            console.error('Error removing candidate:', error);
            alert('Error removing candidate: ' + error.message);
        });
}

// Generate Voter ID
if (generateVoterIdBtn && generateVoterIdModal) {
    generateVoterIdBtn.addEventListener('click', () => {
        loadApprovedApplications();
        generateVoterIdModal.style.display = 'block';
    });
}

function loadApprovedApplications() {
    const approvedApplicationsList = document.getElementById('approvedApplicationsList');
    if (approvedApplicationsList) {
        db.collection('voterIdApplications')
            .where('status', '==', 'approved')
            .get()
            .then((querySnapshot) => {
                approvedApplicationsList.innerHTML = '';
                if (querySnapshot.empty) {
                    approvedApplicationsList.innerHTML = '<p>No approved applications to generate Voter IDs.</p>';
                } else {
                    querySnapshot.forEach((doc) => {
                        const application = doc.data();
                        const applicationElement = document.createElement('div');
                        applicationElement.className = 'application-item';
                        applicationElement.innerHTML = `
                            <p>Name: ${application.name}</p>
                            <p>Father's Name: ${application.fatherName}</p>
                            <p>Mother's Name: ${application.motherName}</p>
                            <p>DOB: ${application.dob}</p>
                            <p>Mobile: ${application.mobileNumber}</p>
                            <p>Address: ${application.address}</p>
                            <button onclick="generateVoterId('${doc.id}')" class="btn btn-success">Generate Voter ID</button>
                        `;
                        approvedApplicationsList.appendChild(applicationElement);
                    });
                }
            })
            .catch((error) => {
                console.error('Error loading approved applications:', error);
                approvedApplicationsList.innerHTML = '<p>Error loading approved applications. Please try again.</p>';
            });
    }
}

function generateVoterId(applicationId) {
    const voterId = 'VID' + Date.now();

    db.collection('voterIdApplications').doc(applicationId).update({
        status: 'completed',
        voterId: voterId
    })
    .then(() => {
        alert(`Voter ID generated successfully! Voter ID: ${voterId}`);
        loadApprovedApplications();
    })
    .catch((error) => {
        console.error('Error generating voter ID:', error);
        alert('Error generating voter ID: ' + error.message);
    });
}

// Declare Results
if (declareResultsBtn && declareResultsModal) {
    declareResultsBtn.addEventListener('click', () => {
        loadVoteCounts();
        declareResultsModal.style.display = 'block';
    });
}

function loadVoteCounts() {
    const voteCountsList = document.getElementById('voteCountsList');
    if (voteCountsList) {
        db.collection('candidates').get()
            .then((candidatesSnapshot) => {
                voteCountsList.innerHTML = '';
                candidatesSnapshot.forEach((doc) => {
                    const candidate = doc.data();
                    const candidateElement = document.createElement('div');
                    candidateElement.innerHTML = `
                        <p>${candidate.name} (${candidate.party}): ${candidate.voteCount || 0} votes</p>
                    `;
                    voteCountsList.appendChild(candidateElement);
                });
            })
            .catch((error) => {
                console.error('Error loading vote counts:', error);
                voteCountsList.innerHTML = '<p>Error loading vote counts. Please try again.</p>';
            });
    }
}

const declareWinnerBtn = document.getElementById('declareWinnerBtn');
if (declareWinnerBtn) {
    declareWinnerBtn.addEventListener('click', () => {
        db.collection('candidates').orderBy('voteCount', 'desc').limit(1).get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const winnerDoc = querySnapshot.docs[0];
                    const winner = winnerDoc.data();
                    return db.collection('electionResults').add({
                        winnerId: winnerDoc.id,
                        winnerName: winner.name,
                        winnerParty: winner.party,
                        votes: winner.voteCount || 0,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    throw new Error('No candidates found');
                }
            })
            .then(() => {
                alert('Election winner declared successfully!');
                declareResultsModal.style.display = 'none';
            })
            .catch((error) => {
                console.error('Error declaring winner:', error);
                alert('Error declaring winner: ' + error.message);
            });
    });
}

// View Results (for users)
if (viewResultsBtn && viewResultsModal) {
    viewResultsBtn.addEventListener('click', () => {
        loadElectionResults();
        viewResultsModal.style.display = 'block';
    });
}

function loadElectionResults() {
    const electionResultsContent = document.getElementById('electionResultsContent');
    if (electionResultsContent) {
        db.collection('electionResults')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const result = querySnapshot.docs[0].data();
                    electionResultsContent.innerHTML = `
                        <h3>Winner: ${result.winnerName}</h3>
                        <p>Party: ${result.winnerParty}</p>
                        <p>Votes: ${result.votes}</p>
                    `;
                } else {
                    electionResultsContent.innerHTML = '<p>No election results available.</p>';
                }
            })
            .catch((error) => {
                console.error('Error loading election results:', error);
                electionResultsContent.innerHTML = '<p>Error loading election results. Please try again.</p>';
            });
    }
}

// Close modal functionality
Array.from(closeButtons).forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
        const modal = closeButton.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};