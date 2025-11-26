import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← AGREGAR ESTA IMPORTACIÓN
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // ← AGREGAR FormsModule AQUÍ
  template: `
    <div class="user-management-container">
      <div class="page-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios del sistema</p>
      </div>

      <div class="users-table">
        <div class="table-header">
          <div class="search-box">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
            />
            <span>🔍</span>
          </div>
          <div class="table-actions">
            <select [(ngModel)]="roleFilter" (change)="onFilterChange()">
              <option value="">Todos los roles</option>
              <option value="reader">Lector</option>
              <option value="registered_user">Usuario Registrado</option>
              <option value="journalist">Periodista</option>
              <option value="moderator">Moderador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td class="user-info">
                <div class="user-avatar">
                  {{ user.name?.charAt(0) }}
                </div>
                <div class="user-details">
                  <strong>{{ user.name }}</strong>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <select
                  [value]="user.role"
                  (change)="onRoleChange(user, $event)"
                  [disabled]="user._id === currentUserId"
                >
                  <option value="reader">Lector</option>
                  <option value="registered_user">Usuario Registrado</option>
                  <option value="journalist">Periodista</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                <span [class]="'status-badge ' + (user.isActive ? 'active' : 'inactive')">
                  {{ user.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ user.createdAt | date : 'shortDate' }}</td>
              <td class="actions">
                <button
                  *ngIf="user._id !== currentUserId"
                  (click)="toggleUserStatus(user)"
                  [class]="user.isActive ? 'btn-warning' : 'btn-success'"
                >
                  {{ user.isActive ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredUsers.length === 0" class="empty-state">
          <p>No se encontraron usuarios</p>
        </div>
      </div>

      <div class="user-stats">
        <h3>Estadísticas de Usuarios</h3>
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of userStats">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-management-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .page-header {
        margin-bottom: 2rem;
      }
      .page-header h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
      }
      .search-box {
        position: relative;
        flex: 1;
        max-width: 300px;
      }
      .search-box input {
        width: 100%;
        padding: 0.5rem 2.5rem 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 20px;
      }
      .search-box span {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }
      .table-actions select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .users-table {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        background: #007bff;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .user-details {
        line-height: 1.2;
      }
      select {
        padding: 0.25rem 0.5rem;
        border: 1px solid #ddd;
        border-radius: 3px;
        background: white;
      }
      select:disabled {
        background: #f8f9fa;
        color: #666;
      }
      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .status-badge.active {
        background: #d4edda;
        color: #155724;
      }
      .status-badge.inactive {
        background: #f8d7da;
        color: #721c24;
      }
      .actions {
        display: flex;
        gap: 0.25rem;
      }
      .btn-success,
      .btn-warning {
        padding: 0.25rem 0.75rem;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.75rem;
      }
      .btn-success {
        background: #28a745;
        color: white;
      }
      .btn-warning {
        background: #ffc107;
        color: #212529;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
      }
      .user-stats {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .stat-item {
        text-align: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 5px;
      }
      .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: #007bff;
      }
      .stat-label {
        font-size: 0.875rem;
        color: #666;
      }
    `,
  ],
})
export class UserManagementComponent {
  authService = inject(AuthService);

  searchTerm = '';
  roleFilter = '';
  currentUserId = 'current-user-id';

  users: User[] = [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      _id: '2',
      name: 'Moderator User',
      email: 'mod@test.com',
      role: 'moderator',
      isActive: true,
      createdAt: new Date('2024-01-02'),
    },
    {
      _id: '3',
      name: 'Journalist User',
      email: 'journalist@test.com',
      role: 'journalist',
      isActive: true,
      createdAt: new Date('2024-01-03'),
    },
    {
      _id: '4',
      name: 'Regular User',
      email: 'user@test.com',
      role: 'registered_user',
      isActive: false,
      createdAt: new Date('2024-01-04'),
    },
    {
      _id: '5',
      name: 'Reader User',
      email: 'reader@test.com',
      role: 'reader',
      isActive: true,
      createdAt: new Date('2024-01-05'),
    },
  ];

  get filteredUsers() {
    return this.users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  get userStats() {
    const total = this.users.length;
    const active = this.users.filter((u) => u.isActive).length;
    const admins = this.users.filter((u) => u.role === 'admin').length;
    const journalists = this.users.filter((u) => u.role === 'journalist').length;

    return [
      { label: 'Total Usuarios', value: total },
      { label: 'Usuarios Activos', value: active },
      { label: 'Administradores', value: admins },
      { label: 'Periodistas', value: journalists },
    ];
  }

  onSearchChange(): void {
    console.log('Buscando:', this.searchTerm);
  }

  onFilterChange(): void {
    console.log('Filtrando por rol:', this.roleFilter);
  }

  onRoleChange(user: User, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value as User['role'];
    console.log(`Cambiando rol de ${user.name} a ${newRole}`);
    // Aquí iría la llamada al servicio
  }

  toggleUserStatus(user: User): void {
    console.log(`${user.isActive ? 'Desactivando' : 'Activando'} usuario:`, user.name);
    // Aquí iría la llamada al servicio
  }
}
