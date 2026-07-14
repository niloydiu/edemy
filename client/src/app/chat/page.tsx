'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Send, MessageSquare, User, Loader2 } from 'lucide-react';

function ChatContent() {
  const { api, user } = useAuth();
  const searchParams = useSearchParams();
  const targetTutorId = searchParams.get('tutorId');
  const targetRecipientId = searchParams.get('recipientId');

  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load contacts
  const loadContacts = async () => {
    try {
      const res = await api.get('/chat/contacts');
      setContacts(res.data);
      
      // If a specific contact is targeted in the URL query parameters
      const directTarget = targetTutorId || targetRecipientId;
      if (directTarget) {
        // Fetch direct target profile info
        const targetRes = await api.get(`/users/${directTarget}`);
        const found = res.data.find((c: any) => c._id === directTarget);
        if (!found) {
          // If not in contact list yet, temporarily push it
          setContacts((prev) => [targetRes.data, ...prev]);
        }
        setActiveContact(targetRes.data);
      } else if (res.data.length > 0 && !activeContact) {
        setActiveContact(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load chat contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user, targetTutorId, targetRecipientId]);

  // Load message history when active contact changes
  useEffect(() => {
    async function loadHistory() {
      if (!activeContact) return;
      setLoadingMessages(true);
      try {
        const res = await api.get(`/chat/history?recipientId=${activeContact._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadHistory();
  }, [activeContact]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeContact) return;
    try {
      const res = await api.post('/chat', {
        receiverId: activeContact._id,
        message: typedMessage,
      });
      setMessages((prev) => [...prev, res.data]);
      setTypedMessage('');
      
      // Refresh contact list to make sure recipient is on list
      const exists = contacts.some((c) => c._id === activeContact._id);
      if (!exists) {
        await loadContacts();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full flex gap-6 h-[calc(100vh-140px)]">
        
        {/* Contacts Sidebar */}
        <div className="w-80 glassmorphic p-4 rounded-lg border border-white/10 flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-neonCyan flex items-center gap-1.5 border-b border-white/5 pb-3">
            <MessageSquare className="w-4 h-4" /> Message Channels
          </h3>

          {loadingContacts ? (
            <div className="text-xs text-gray-500 animate-pulse font-bold uppercase p-4 text-center">
              Scanning active channels...
            </div>
          ) : contacts.length === 0 ? (
            <p className="text-xs text-gray-500 font-bold uppercase p-4 text-center">No active chats.</p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full text-left p-3 rounded flex items-center gap-3 border transition-all ${
                    activeContact?._id === contact._id
                      ? 'bg-neonCyan/10 border-neonCyan'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <img
                    src={contact.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${contact.name}`}
                    alt=""
                    className="w-8 h-8 rounded-full border border-white/10"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-black uppercase text-white truncate">{contact.name}</h4>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block mt-0.5">
                      {contact.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message View Area */}
        <div className="flex-1 glassmorphic rounded-lg border border-white/10 flex flex-col overflow-hidden">
          {activeContact ? (
            <>
              {/* Header */}
              <div className="bg-white/5 border-b border-white/5 p-4 flex items-center gap-3">
                <img
                  src={activeContact.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeContact.name}`}
                  alt=""
                  className="w-10 h-10 rounded-full border border-neonCyan/30"
                />
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-wide">{activeContact.name}</h3>
                  <span className="text-[10px] text-neonCyan font-bold uppercase tracking-wider capitalize">
                    {activeContact.role} &bull; Online Channel
                  </span>
                </div>
              </div>

              {/* Message Log */}
              <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-black/10">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full text-xs text-gray-500 uppercase font-bold tracking-widest">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Synching logs...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-xs text-gray-600 uppercase font-bold tracking-widest">
                    No logs recorded. Send a message to start conversing.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isOwnMessage = m.senderId === user?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div
                          className={`p-3 rounded text-xs leading-relaxed ${
                            isOwnMessage
                              ? 'bg-neonCyan text-black font-semibold rounded-br-none'
                              : 'bg-white/5 border border-white/10 text-white rounded-bl-none'
                          }`}
                        >
                          {m.message}
                        </div>
                        <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/3 flex gap-3">
                <input
                  type="text"
                  required
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Enter secure message packet..."
                  className="flex-grow bg-background border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neonCyan"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-neonCyan text-black font-extrabold uppercase text-xs rounded hover:scale-[1.02] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  SEND <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-xs text-gray-500 uppercase font-bold tracking-widest">
              Please establish contact to inspect logs.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <span className="text-xs text-gray-500 animate-pulse font-bold uppercase tracking-widest">
            Resolving Neural Communication Streams...
          </span>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
