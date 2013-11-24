/**
 * Post Item Parent View
 *
 * @module     PostItemView
 * @author     Ushahidi Team <team@ushahidi.com>
 * @copyright  2013 Ushahidi
 * @license    https://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License Version 3 (AGPL3)
 */

define(['App', 'marionette', 'underscore', 'handlebars', 'alertify', 'text!templates/PostListItem.html'],
	function(App, Marionette, _, Handlebars, alertify, template)
	{
		//ItemView provides some default rendering logic
		return Marionette.ItemView.extend(
		{

			events: {
				'click .js-post-delete': 'deletePost',
				'click .js-post-edit' : 'showEditPost',
				'click .js-post-set' : 'showAddToSet',
				'click .js-post-publish' : 'publishPost',
				'click .js-post-unpublish' : 'unpublishPost'
			},

			modelEvents: {
				'sync': 'render'
			},

			deletePost: function(e)
			{
				var that = this;
				e.preventDefault();
				alertify.confirm('Are you sure you want to delete?', function(e)
				{
					if (e)
					{
						that.model.destroy({
							// Wait till server responds before destroying model
							wait: true
						}).done(function()
						{
							alertify.success('Post has been deleted');
						}).fail(function ()
						{
							alertify.error('Unable to delete post, please try again');
						});
					}
					else
					{
						alertify.log('Delete cancelled');
					}
				});
			},

			publishPost: function(e)
			{
				var that = this;
				e.preventDefault();

				this.model.set('status', 'published');

				this.model.save()
				.done(function()
				{
					alertify.success('Post has been published');
				}).fail(function ()
				{
					alertify.error('Unable to publish post, please try again');
				});
			},

			unpublishPost: function(e)
			{
				var that = this;
				e.preventDefault();

				this.model.set('status', 'draft');

				this.model.save()
				.done(function()
				{
					alertify.success('Post has been unpublished');
				}).fail(function ()
				{
					alertify.error('Unable to un-publish post, please try again');
				});
			},

			serializeData: function()
			{
				var data = _.extend(this.model.toJSON(), {
					isPublished : this.model.isPublished(),
					tags : this.model.getTags(),
					user : this.model.user ? this.model.user.toJSON() : null,
					location : this.model.getLocation()
				});
				return data;
			},
			showEditPost : function ()
			{
				App.vent.trigger('post:edit', this.model);
			},
			showAddToSet : function ()
			{
				App.vent.trigger('post:set', this.model);
			}
		});
	});
