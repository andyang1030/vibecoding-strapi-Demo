import type { Core } from '@strapi/strapi';
import profileSeed from './data/profile.json';

const PROFILE_UID = 'api::profile.profile';
const PUBLIC_ROLE_UID = 'plugin::users-permissions.role';
const PERMISSION_UID = 'plugin::users-permissions.permission';

async function ensurePublicProfilePermission(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query(PUBLIC_ROLE_UID).findOne({
    where: { type: 'public' },
  });

  if (!publicRole?.id) {
    return;
  }

  const requiredActions = [
    'api::profile.profile.find',
    'api::profile.profile.findOne',
  ];

  for (const action of requiredActions) {
    const existingPermission = await strapi.db.query(PERMISSION_UID).findOne({
      where: {
        role: publicRole.id,
        action,
      },
    });

    if (!existingPermission) {
      await strapi.db.query(PERMISSION_UID).create({
        data: {
          action,
          role: publicRole.id,
        },
      });
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicProfilePermission(strapi);

    const documentService = (strapi as any).documents?.(PROFILE_UID);

    if (documentService) {
      const existingProfile = await documentService.findFirst({});

      if (existingProfile?.documentId) {
        return;
      }

      await documentService.create({
        data: profileSeed,
      });

      return;
    }

    const entityService = (strapi as any).entityService;
    const existingProfile = await entityService.findMany(PROFILE_UID, {
      limit: 1,
    });
    const currentProfile = Array.isArray(existingProfile)
      ? existingProfile[0]
      : existingProfile;

    if (currentProfile?.id) {
      return;
    }

    await entityService.create(PROFILE_UID, {
      data: profileSeed,
    });
  },
};
