import type { Schema, Struct } from '@strapi/strapi';

export interface ProfileProfileImages extends Struct.ComponentSchema {
  collectionName: 'components_profile_profile_images';
  info: {
    description: 'Profile image asset paths';
    displayName: 'Profile Images';
  };
  attributes: {
    avatarSrc: Schema.Attribute.Media<'images'>;
    backgroundSrc: Schema.Attribute.Media<'images'>;
  };
}

export interface ProfileProfileInfo extends Struct.ComponentSchema {
  collectionName: 'components_profile_profile_infos';
  info: {
    description: 'Core profile text content';
    displayName: 'Profile Info';
  };
  attributes: {
    avatarAlt: Schema.Attribute.String & Schema.Attribute.Required;
    bio: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProfileSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_profile_social_links';
  info: {
    description: 'Profile social link item';
    displayName: 'Social Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'profile.profile-images': ProfileProfileImages;
      'profile.profile-info': ProfileProfileInfo;
      'profile.social-link': ProfileSocialLink;
    }
  }
}
