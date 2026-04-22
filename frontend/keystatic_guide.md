# AquaVida Content Management Guide

This guide explains how to manage your content using Keystatic Cloud and leverage the new advanced text features.

## 1. How to Add Blog Posts in Live

Since your site is live on **Vercel** and integrated with **GitHub** and **Keystatic Cloud**, the process is seamless:

1.  **Access Admin Dashboard**: Go to your live site's Keystatic admin path (usually `/keystatic` or `https://keystatic.aquavidapools.com` depending on your setup).
2.  **Login**: Authenticate using your GitHub account (this is how Keystatic Cloud manages permissions).
3.  **Create New Post**:
    *   Navigate to **Blog Posts** in the sidebar.
    *   Click the **Create** button.
    *   Enter your **Post Title** (this automatically generates the URL slug).
4.  **Edit Content**: Use the newly enhanced **Body Content** editor (see details below).
5.  **Publishing (The "Save" Flow)**:
    *   When you click **Create** or **Save** in Keystatic Cloud, it doesn't just save to a database.
    *   **Keystatic commits the changes directly to your GitHub repository** as a new commit.
    *   **Vercel detects the new commit** and automatically triggers a "Production Build".
    *   Within 1–2 minutes, your new blog post will be live on the site.

---

## 2. Using the Advanced Text Editor (WordPress-Style)

We have updated the text editor to provide full controls similar to WordPress.

### Features Now Available:
-   **Headings**: Support for H1 through H6.
-   **Inline Styles**: Underline, Strikethrough, Superscript, Subscript, and Inline Code.
-   **Alignment**: Center and Right-align text for better layout control.
-   **Lists**: Full support for Bulleted and Numbered lists.
-   **Blockquotes**: Highlight authority quotes or important snippets.
-   **Dividers**: Add horizontal lines to separate sections.

### Internal Linking (SEO Interlinking)
The editor now highlights links more prominently. To add an internal link:
1.  Highlight the text you want to link.
2.  Click the **Link icon** in the toolbar (or press `Ctrl+K`).
3.  Type the internal path (e.g., `/services/pool-construction` or `/portfolio/brycewood`).
4.  Press Enter.

---

## 3. SEO & Google Tag Manager

### Google Tag Manager (GTM)
You can now manage your GTM container directly from the CMS:
1.  Go to **SEO — Global** in the Keystatic sidebar.
2.  Find the **Google Tag Manager ID** field.
3.  Paste your ID (e.g., `GTM-XXXXXXX`).
4.  Save changes. The site will automatically redeploy with the GTM container active.

### Optimized SEO Fields
Every Blog Post and Page now has a dedicated **SEO Section** at the bottom.
-   **Meta Title & Description**: Customize exactly how your page appears in Google search results.
-   **Social Image (OG Image)**: Choose a specific image for when your post is shared on Facebook or X/Twitter.
-   **No Index/No Follow**: Hide specific pages from search engines if they are for internal use or under construction.
