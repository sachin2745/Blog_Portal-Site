const { model, Schema } = require('../connection');
const slugify = require('slugify');

const mySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    content: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

mySchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('title')) {
        const baseSlug = slugify(this.title, { lower: true, strict: true });

        let slug = baseSlug;
        let slugExists = await PostCollection.findOne({ slug });
        let counter = 1;

        while (slugExists) {
            slug = `${baseSlug}-${counter}`;
            slugExists = await PostCollection.findOne({ slug });
            counter++;
        }

        this.slug = slug;
    }
    next();
});

const PostCollection = model('PostCollection', mySchema);

module.exports = PostCollection;