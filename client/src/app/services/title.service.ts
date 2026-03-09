import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly appName = 'SnippetVault';

  constructor(private title: Title) {}

  setTitle(pageTitle?: string) {
    this.title.setTitle(
      pageTitle ? `${pageTitle} | ${this.appName}` : this.appName
    );
  }
}