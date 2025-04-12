import Navigation from '@/components/Navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from "next/image";

export default function GroupsPage {
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="ml-16 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-[#F4A460]">Groups</h1>
            <p className="text-gray-500 text-sm">making moves, for real.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
            
            {/* Create New Group Card */}
            <Link
              href="/groups/create"
              className="h-48 rounded-lg border-2 border-dashed border-[#F4A460] bg-white p-6 flex items-center justify-center hover:bg-[#F4A460]/5 transition-colors"
            >
              <div className="text-center">
                <PlusIcon className="w-12 h-12 text-[#F4A460] mx-auto mb-2" />
                <p className="text-[#F4A460] font-medium">Create New Group</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function GroupCard({ group }: { group: any }) {
    return (
      <Link
        href={`/groups/${group.id}`}
        className="block h-48 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <h3 className="text-xl font-medium text-gray-900 mb-2">{group.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{group.description}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-400">{group.memberCount} members</p>
        </div>
      </Link>
    );
} 