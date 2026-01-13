"use client";
import { useState } from 'react';
import { MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';

interface ClientActionsMenuProps {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ClientActionsMenu({ onView, onEdit, onDelete }: ClientActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Actions"
            >
                <MoreVertical size={18} className="text-slate-400" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onView();
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center gap-3 text-sm text-slate-300 transition-colors"
                        >
                            <Eye size={16} />
                            Ver Detalhes
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onEdit();
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center gap-3 text-sm text-slate-300 transition-colors border-t border-slate-800/50"
                        >
                            <Edit2 size={16} />
                            Editar Cliente
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onDelete();
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-red-500/10 flex items-center gap-3 text-sm text-red-400 transition-colors border-t border-slate-800/50"
                        >
                            <Trash2 size={16} />
                            Deletar Cliente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
