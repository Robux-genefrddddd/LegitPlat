import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Moon, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ isOpen, onOpenChange }: SettingsModalProps) {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userData?.displayName) {
      setDisplayName(userData.displayName);
    }
  }, [userData?.displayName, isOpen]);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 10);
    setDisplayName(value);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!user?.uid || !displayName.trim()) {
      toast.error("Le pseudo ne peut pas être vide");
      return;
    }

    try {
      setIsSaving(true);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
      });
      setHasChanges(false);
      toast.success("Paramètres sauvegardés");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      onOpenChange(false);
      toast.success("Déconnecté avec succès");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-white/[0.1] rounded-xl max-w-md h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">
            Paramètres
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 mt-4 px-2">
          {/* Profile Photo Upload */}
          {user?.uid && (
            <>
              <div className="animate-fadeIn">
                <ProfilePhotoUpload
                  userId={user.uid}
                  currentPhotoUrl={
                    userData?.profilePhotoURL || user.photoURL || undefined
                  }
                  displayName={
                    userData?.displayName || user.displayName || "User"
                  }
                />
              </div>
              <div className="h-px bg-white/[0.08]"></div>
            </>
          )}

          {/* Display Name Setting */}
          <div className="space-y-2 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <label className="block text-sm font-medium text-foreground">
              Pseudo
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                placeholder="Votre pseudo..."
                maxLength={10}
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all text-sm"
              />
              <span className="absolute right-3 top-2.5 text-xs text-foreground/50">
                {displayName.length}/10
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div
            className="flex items-center justify-between p-4 hover:bg-white/[0.03] rounded-lg transition-colors border border-white/[0.05] animate-fadeIn"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-primary/80" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mode Sombre
                </p>
                <p className="text-xs text-foreground/50">
                  Toujours activé pour cette version
                </p>
              </div>
            </div>
            <div className="w-11 h-6 bg-primary/30 rounded-full flex items-center justify-end p-0.5 cursor-default">
              <div className="w-5 h-5 bg-white rounded-full transition-transform" />
            </div>
          </div>

          {/* Email Display (Read-only) */}
          <div
            className="space-y-2 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg px-4 py-2.5 text-foreground/70 text-sm">
              {user?.email || "..."}
            </div>
          </div>
        </div>

        {/* Sticky Footer with Buttons */}
        <div className="border-t border-white/[0.08] pt-4 pb-2 space-y-3 animate-fadeIn" style={{ animationDelay: "0.25s" }}>
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
            className="w-full px-4 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary font-medium text-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Enregistrement...
              </span>
            ) : (
              "Enregistrer"
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 font-medium text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
