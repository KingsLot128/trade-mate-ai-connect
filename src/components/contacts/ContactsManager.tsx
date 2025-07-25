import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Mail, Phone, MapPin, Star } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'customer' | 'prospect';
  location?: string;
  lastContact?: string;
  value?: string;
  priority: 'high' | 'medium' | 'low';
}

const ContactsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@email.com',
      phone: '(555) 123-4567',
      company: 'Smith Construction',
      status: 'customer',
      location: 'Downtown',
      lastContact: '2 days ago',
      value: '$15,000',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@gmail.com',
      phone: '(555) 987-6543',
      status: 'lead',
      location: 'Westside',
      lastContact: '1 week ago',
      value: '$8,500',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      phone: '(555) 456-7890',
      company: 'Wilson Properties',
      status: 'prospect',
      location: 'Eastside',
      lastContact: '3 days ago',
      value: '$25,000',
      priority: 'high'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="h-3 w-3 fill-current text-red-500" />;
      case 'medium': return <Star className="h-3 w-3 fill-current text-yellow-500" />;
      case 'low': return <Star className="h-3 w-3 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage your customers, leads, and prospects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === 'customer').length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === 'lead').length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prospects</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === 'prospect').length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{contact.name}</h3>
                      {getPriorityIcon(contact.priority)}
                    </div>
                    {contact.company && (
                      <p className="text-sm text-muted-foreground">{contact.company}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-1">
                      {contact.email && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.location && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{contact.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Badge className={getStatusColor(contact.status)} variant="outline">
                      {contact.status}
                    </Badge>
                    {contact.value && (
                      <p className="text-sm font-medium mt-1">{contact.value}</p>
                    )}
                    {contact.lastContact && (
                      <p className="text-xs text-muted-foreground">Last: {contact.lastContact}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Start adding contacts to manage your customer relationships'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactsManager;