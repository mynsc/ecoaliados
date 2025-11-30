import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Button,
} from '@/components/ui';
import type { Profile } from '@/contexts';

interface ProfileEditModalProps {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, avatar: string) => void;
}

const AVATAR_OPTIONS = [
  '🌱', '🌿', '🌳', '🌲', '🌴',
  '♻️', '🌍', '🌎', '🌏', '💚',
  '🍃', '🌾', '🌺', '🌻', '🌼',
  '🦋', '🐝', '🐛', '🌈', '☀️',
];

export function ProfileEditModal({
  profile,
  open,
  onOpenChange,
  onSave,
}: ProfileEditModalProps) {
  const [tempName, setTempName] = useState(profile.name);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);
  const [error, setError] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reset temp values when modal opens and focus input
  useEffect(() => {
    if (open) {
      setTempName(profile.name);
      setTempAvatar(profile.avatar);
      setError('');
      
      // Focus on name input after modal opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    }
  }, [open, profile.name, profile.avatar]);

  const handleSave = () => {
    // Validations
    const trimmedName = tempName.trim();
    
    if (!trimmedName) {
      setError('El nombre no puede estar vacío');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('El nombre no puede tener más de 50 caracteres');
      return;
    }

    // Call onSave callback
    onSave(trimmedName, tempAvatar);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tempName.trim().length >= 2) {
      handleSave();
    }
  };

  // Check if form is valid
  const isFormValid = tempName.trim().length >= 2 && tempName.trim().length <= 50;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              ref={nameInputRef}
              id="name"
              value={tempName}
              onChange={(e) => {
                setTempName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tu nombre"
              maxLength={50}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Avatar Selection */}
          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setTempAvatar(emoji)}
                  className={`
                    text-3xl p-3 rounded-lg border-2 transition-all
                    hover:scale-110 hover:shadow-md
                    ${
                      tempAvatar === emoji
                        ? 'border-green-500 bg-green-50 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  aria-label={`Seleccionar avatar ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
