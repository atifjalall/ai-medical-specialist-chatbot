import { Session, User } from '@/lib/types'
import { getUser } from '../app/login/actions'
import { useEffect, useState } from 'react'

export interface EmptyScreenProps {
  user?: Session['user']
}

export function EmptyScreen({ user }: EmptyScreenProps) {
  const [fetchedUser, setFetchedUser] = useState<User | null>(null)
  console.log("Session user:", user);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        const fetchedData = await getUser(user.email)
        setFetchedUser(fetchedData)
      }
    }

    fetchUserData()
  }, [user])

  // Helper function to get the display name
  const getDisplayName = () => {
    if (!fetchedUser) return 'Guest';

    // First check for firstName
    if (fetchedUser.firstName) {
      return fetchedUser.firstName;
    }

    // If no firstName but has name, extract first name from full name
    if (fetchedUser.name) {
      return fetchedUser.name.split(' ')[0];
    }

    // Fallback to email or Guest
    return fetchedUser.email?.split('@')[0] || 'Guest';
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="mx-auto max-w-2xl px-4 -mt-32">
        <div className="flex flex-col gap-2 sm:p-8 p-4 text-sm sm:text-base">
          <h1
            className="text-6xl sm:text-5xl tracking-tight font-semibold whitespace-nowrap
                       bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text"
          >
            Hello, {getDisplayName()}
          </h1>
        </div>
      </div>
    </div>
  )
}
