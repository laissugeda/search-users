import { Component, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GitHubUser } from '../../services/github.service'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  user = input.required<GitHubUser>()
}