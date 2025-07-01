// app.js
// Initialisation Supabase
const supabaseUrl = 'https://gaucwdfyskhghndkuftu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdWN3ZGZ5c2toZ2huZGt1ZnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjY4MTEsImV4cCI6MjA2NjkwMjgxMX0.0qHE7Mt4eENEXP97jxb41ulRIGg-3zab1kvGzqEkjMw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Authentification
async function loginWithSupabase(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user, error };
}

// Ajout d'un patient
async function addPatientToSupabase(patient) {
  const { data, error } = await supabase.from('patients').insert([patient]);
  return { data, error };
}

// Récupération des patients
async function getPatientsFromSupabase() {
  const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
  return { data, error };
}

// Ajout d'une consultation
async function addConsultationToSupabase(consultation) {
  const { data, error } = await supabase.from('consultations').insert([consultation]);
  return { data, error };
}

// Récupération des consultations
async function getConsultationsFromSupabase() {
  const { data, error } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
  return { data, error };
}

// Ajout d'une ordonnance
async function addOrdonnanceToSupabase(ordonnance) {
  const { data, error } = await supabase.from('ordonnances').insert([ordonnance]);
  return { data, error };
}

// Récupération des ordonnances
async function getOrdonnancesFromSupabase() {
  const { data, error } = await supabase.from('ordonnances').select('*').order('created_at', { ascending: false });
  return { data, error };
}

// Ajout d'une analyse
async function addAnalyseToSupabase(analyse) {
  const { data, error } = await supabase.from('analyses').insert([analyse]);
  return { data, error };
}

// Récupération des analyses
async function getAnalysesFromSupabase() {
  const { data, error } = await supabase.from('analyses').select('*').order('created_at', { ascending: false });
  return { data, error };
}

// Met à jour le rôle d'un utilisateur (superadmin seulement)
async function updateUserRole(user_id, newRole) {
  const { data, error } = await supabase.from('users').update({ role: newRole }).eq('id', user_id);
  return { data, error };
}

// Réinitialise le mot de passe d'un utilisateur (superadmin seulement)
async function resetUserPassword(email, newPassword) {
  // Utilise la fonction d'admin Supabase (nécessite une clé de service côté serveur normalement)
  // Ici, on simule côté client (à adapter côté backend pour la prod)
  const { data, error } = await supabase.auth.admin.updateUserByEmail(email, { password: newPassword });
  return { data, error };
}

// Supprime un utilisateur (superadmin seulement)
async function deleteUserById(user_id) {
  const { data, error } = await supabase.from('users').delete().eq('id', user_id);
  return { data, error };
}

// Récupère tous les utilisateurs (superadmin seulement)
async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('*');
  return { data, error };
}

// Inscription intelligente : premier inscrit = superadmin, les autres = medecin_chef
async function registerUser(email, password, nom, prenom) {
  // Inscription via Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };

  // Vérifier s'il existe déjà un superadmin
  const { data: users } = await supabase.from('users').select('role');
  const hasSuperadmin = users && users.some(u => u.role === 'superadmin');
  const role = hasSuperadmin ? 'medecin_chef' : 'superadmin';

  // Ajouter dans la table users
  const { error: insertError } = await supabase.from('users').insert([
    { id: data.user.id, email, nom, prenom, role }
  ]);
  return { error: insertError };
} 