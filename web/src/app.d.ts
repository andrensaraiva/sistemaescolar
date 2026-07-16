// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Papel, Skin, Modo } from '$lib/ui/skin';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			/** Valida o JWT no servidor. Nunca usar auth.getSession() direto numa
			    decisão de acesso: ele não confere a assinatura. */
			sessaoSegura: () => Promise<{ session: Session | null; user: User | null }>;
			papel: Papel | null;
			skin: Skin;
			modo: Modo;
		}
		interface PageData {
			papel: Papel | null;
			skin: Skin;
			modo: Modo;
		}
	}
}

export {};
